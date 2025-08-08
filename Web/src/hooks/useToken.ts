export const useToken = () => {
  const set = (token: string) => localStorage.setItem('token', token);
  const get = () => localStorage.getItem('token');
  const remove = () => localStorage.removeItem('token');
  return { set, get, remove };
};
