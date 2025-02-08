import { useRouter } from "@/navigation";

export default function usePageModal() {
  const router = useRouter();

  const handleModalDismiss = () => {
    try {
      if (typeof window !== "undefined") {
        if (window.history.length > 1) {
          if (router) {
            router.back();
          }
        } else {
          window.location.href = "/";
        }
      } else {
        router.back();
      }
    } catch (error) {
      window.location.href = "/";
    }
  };

  return { handleModalDismiss };
}
