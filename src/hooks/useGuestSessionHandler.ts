import { useEffect, useRef, useState } from "react";
import { updateSession } from "@/store/features/auth/authSlice";
import { toggleModal } from "@/store/features/global/globalSlice";
import { getGuestSession } from "@/utils/getSessionHandler";
import { useAppDispatch } from "@/store/hooks";

export const useGuestSessionHandler = (session: any) => {
  const dispatch = useAppDispatch();
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const fetchGuestSession = async () => {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));
      
      try {
        const guestSession = getGuestSession();
        
        if (session?.isGuest && guestSession) {
          dispatch(toggleModal({ loadingModal: { isOpen: false } }));
          return;
        }
        
        if (session?.isGuest && !guestSession) {
          dispatch(
            updateSession({
              isGuest: false,
              isLoggedIn: false,
              isUser: false,
              info: undefined,
              picture: undefined,
            })
          );

          dispatch(toggleModal({ allowTrackingModal: { isOpen: true } }));
        }
      } catch (e) {
        console.error('Guest session check error:', e);
      } finally {
        dispatch(toggleModal({ loadingModal: { isOpen: false } }));
      }
    };

    fetchGuestSession();
  }, [dispatch, session?.isGuest, isMounted]); 
};