import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from "@reduxjs/toolkit";

const userTokenMiddleware: Middleware = (_store: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
  const result = next(action);

  if (action.type === "user/authenticate") {
    const token: string = action.payload.token;
    localStorage.setItem("toursAppLoggedInUserToken", token);
  }

  if (action.type === "user/logout") {
    localStorage.removeItem("toursAppLoggedInUserToken");
  }

  return result;
};

export default userTokenMiddleware;
