import { createTheme } from "@mui/material/styles";

let theme = createTheme({});

theme = createTheme(theme, {
  palette: {
    mode: "light",
    text: {
      primary: "#4a4e69",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#4a4e69",
        },
      },
      variants: [
        {
          props: { variant: "h1" },
          style: {
            fontSize: "1.8rem",
            fontWeight: "bold",
            padding: "0.8rem 0",
          },
        },
        {
          props: { variant: "h2" },
          style: {
            fontSize: "1.4rem",
            fontWeight: "bold",
            padding: "0.6rem 0",
          },
        },
        {
          props: { variant: "h3" },
          style: {
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "0.4rem 0",
          },
        },
        {
          props: { variant: "body1" },
          style: {
            fontSize: "1rem",
            padding: "0.12rem 0",
          },
        },
        {
          props: { variant: "body2" },
          style: {
            fontSize: "0.8rem",
            padding: "0.12rem 0",
          },
        },
        {
          props: { variant: "subtitle1" },
          style: {
            fontSize: "1rem",
            padding: "0.3rem 0",
          },
        },
      ],
    },
    MuiIconButton: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "0.5rem",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: "1rem",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: "1rem",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          [theme.breakpoints.up("lg")]: {
            maxWidth: "90%",
          },
        },
      },
    },
  },
});

export default theme;
