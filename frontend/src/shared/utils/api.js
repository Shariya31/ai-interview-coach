export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHealth = async () => {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error("API not reachable");
  }
  return res.json();
};
