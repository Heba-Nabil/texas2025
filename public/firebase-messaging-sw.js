// importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js",
// );

// 'use strict';

// Validate origin and credentials
// const ALLOWED_ORIGINS = [
//   'https://localhost:3000',
//   'https://olo-v7.vercel.app/en',
//   'https://texas-web-6203f.firebaseapp.com',
// ];

// // Security headers middleware
// const securityHeaders = {
//   'Content-Security-Policy': "default-src 'self' https://www.gstatic.com/; script-src 'self' https://www.gstatic.com/; connect-src 'self' https://fcm.googleapis.com/;",
//   'X-Content-Type-Options': 'nosniff',
//   'X-Frame-Options': 'DENY',
//   'X-XSS-Protection': '1; mode=block',
//   'Referrer-Policy': 'strict-origin-when-cross-origin'
// };

// // Origin validation function
// const isValidOrigin = (origin) => {
//   return ALLOWED_ORIGINS.includes(origin);
// };

importScripts(
  "https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyDGTEJA_8XGmtRxmWu9uoxfR0L4Qst3qyI",
  authDomain: "texas-chicken-arabia.firebaseapp.com",
  databaseURL: "https://texas-chicken-arabia.firebaseio.com",
  projectId: "texas-chicken-arabia",
  storageBucket: "texas-chicken-arabia.firebasestorage.app",
  messagingSenderId: "815437862439",
  appId: "1:815437862439:web:786578eaef87a3b139e002",
  measurementId: "G-JEF087KVQV",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  // Validate payload structure
  if (
    !payload.notification ||
    !payload.notification.title ||
    !payload.notification.body
  ) {
    console.error("Invalid payload structure");
    return;
  }

  const link = payload.fcmOptions?.link || payload.data?.link;

  const notificationTitle = payload.notification.title;

  const notificationOptions = {
    body: payload.notification.body,
    icon: "/images/Texas-Icon.gif",
    data: { url: link },
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  // This checks if the client is already open and if it is, it focuses on the tab. If it is not open, it opens a new tab with the URL passed in the notification payload
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;

        if (!url) return;

        // If relative URL is passed in firebase console or API route handler, it may open a new window as the client.url is the full URL i.e. https://example.com/ and the url is /about whereas if we passed in the full URL, it will focus on the existing tab i.e. https://example.com/about
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          console.log("OPENWINDOW ON CLIENT");
          return clients.openWindow(url);
        }
      }),
  );
});
