export const getAuthHeader = () => {
  const token = localStorage.getItem("toursAppLoggedInUserToken");
  if (!token) {
    throw new Error("Token not found");
  }
  const header = { headers: { Authorization: `Bearer ${token}` } };
  return header;
};
