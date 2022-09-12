export const getFromLocalStorage = (key: string) => localStorage.getItem(key);

export const setInLocalStorage = (key: string, value: string) =>
  localStorage.setItem(key, value);
