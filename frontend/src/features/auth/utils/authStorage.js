const AUTH_KEY = "ai_interviewer_auth";

export const saveAuthToStorage = (data) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

export const getAuthFromStorage = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthFromStorage = () => {
  localStorage.removeItem(AUTH_KEY);
};
