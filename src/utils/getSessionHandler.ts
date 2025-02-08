export const setGuestSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('guestLoggedIn', 'true');
  }
};

export const clearGuestSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('guestLoggedIn');
  }
};

export const getGuestSession = (): boolean | null => {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem('guestLoggedIn');
    return data ? data === 'true' : null;
  }
  return null;
};