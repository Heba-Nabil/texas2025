"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { useRouter } from "@/navigation";
import { fetchToken, messaging } from "../lib/firebase";
import { toaster } from "@/components/global/Toaster";

async function getNotificationPermissionAndToken() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return null;
  }

  // If the permission is granted
  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  // If permission was not obtained, it will request approval
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

const useFcmToken = () => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = useCallback(async () => {
    // Prevent mulitple fetches if already fetched
    if (isLoading.current) return;

    isLoading.current = true; // Mark loading as in progress.
    const token = await getNotificationPermissionAndToken(); // Fetch the token.

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.log("Push Notifications issue - permission denied");
      isLoading.current = false;
      return;
    }

    // Retry fetching the token because the service worker may not be ready yet
    if (!token) {
      if (retryLoadToken.current >= 3) {
        alert("Unable to load token, refresh the browser");
        console.log("Unable to load token after 3 retries");
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("An error occurred while retrieving token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    isLoading.current = false;
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      loadToken();
    }
  }, [loadToken]);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return; // Exit if no token is available.

      const m = await messaging();
      if (!m) return;

      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;

        console.log("Foreground push notification received:", payload);
        const link = payload.fcmOptions?.link || payload.data?.link;

        if (link) {
          toaster.success({
            title: payload.notification?.title,
            message: payload.notification?.body,
            link: payload.fcmOptions?.link || payload.data?.link,
            // {
            //   action: {
            //     label: "Visit",
            //     onClick: () => {
            //       const link = payload.fcmOptions?.link || payload.data?.link;
            //       if (link) {
            //         router.push(link);
            //       }
            //     },
            //   },
            // }
          });
        } else {
          toaster.success({
            title: payload.notification?.title,
            message: payload.notification?.body,
          });
        }
        // Disable this if you only want toast notification
        // const n = new Notification(
        //   payload.notification?.title || "New message",
        //   {
        //     body: payload.notification?.body || "This is a new message",
        //     data: link ? { url: link } : undefined,
        //   }
        // );

        // n.onclick = (event) => {
        //   event.preventDefault();
        //   const link = (event.target as any)?.data?.url;
        //   if (link) {
        //     router.push(link);
        //   } else {
        //     console.log("No link found in the notification payload");
        //   }
        // };
      });

      return unsubscribe;
    };

    // Cleanup function
    let unsubscribe: Unsubscribe | null = null;

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub;
      }
    });

    return () => unsubscribe?.();
  }, [token, router]);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
