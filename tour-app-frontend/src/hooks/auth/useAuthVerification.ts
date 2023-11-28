import { useState, useEffect } from "react";
import { User } from "../../types";
import { extractTokenAndUser } from "../../services/authService";

export const useAuthVerification = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedInUserToken = localStorage.getItem("toursAppLoggedInUserToken");
    const tokenExpiry = localStorage.getItem("toursAppTokenExpiry");

    if (loggedInUserToken && tokenExpiry) {
      const currentTime = Date.now();
      if (currentTime < Number(tokenExpiry)) {
        const userData = extractTokenAndUser({ token: loggedInUserToken });
        setUser(userData.user);
      } else {
        localStorage.removeItem("toursAppLoggedInUserToken");
        localStorage.removeItem("toursAppTokenExpiry");
      }
    }
  }, []);

  return user;
};
