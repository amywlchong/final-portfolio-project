import {
  Middleware,
  MiddlewareAPI,
  Dispatch,
  AnyAction,
} from "@reduxjs/toolkit";

const userTokenMiddleware: Middleware =
  (_store: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
    const result = next(action);

    if (action.type === "user/authenticate") {
      const token: string = action.payload.token;
      localStorage.setItem("toursAppLoggedInUserToken", token);

      const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // Current time + 24 hours in milliseconds
      localStorage.setItem("toursAppTokenExpiry", expiryTime.toString());
    }

    if (action.type === "user/logout") {
      localStorage.removeItem("toursAppLoggedInUserToken");
      localStorage.removeItem("toursAppTokenExpiry");
    }

    return result;
  };

export default userTokenMiddleware;
