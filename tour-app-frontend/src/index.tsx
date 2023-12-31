import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { Provider } from "react-redux";
import store from "./app/store";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/MUITheme";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

if (!process.env.REACT_APP_PAYPAL_CLIENT_ID) {
  throw new Error(
    "PAYPAL_CLIENT_ID is not defined in the environment variables."
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PayPalScriptProvider
            options={{
              clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
              currency: "HKD",
            }}
          >
            <App />
          </PayPalScriptProvider>
        </Provider>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
