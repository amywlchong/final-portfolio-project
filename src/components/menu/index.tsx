import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { Close } from "@mui/icons-material";
import logo from "../../assets/images/logo.png";

import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { logout } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize";

const links = [
  { text: "Home", url: "/" },
  { text: "Tours", url: "/tours" },
  { text: "Bookings", url: "/bookings" },
  { text: "Schedules", url: "/tour-guide-schedules" },
  { text: "Users", url: "/users" },
  { text: "My bookings", url: "/me/bookings" },
  { text: "My profile", url: "/me/profile" },
];

const Menu = () => {
  const { isSmallAndUp } = useScreenSize();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((value) => !value);
  }, []);

  const currentUser = useAppSelector((state) => state.user.loggedInUser);
  const dispatch = useAppDispatch();

  const listItemStyle = {
    width: "100%",
    cursor: "pointer",
    ".MuiTypography-root": {
      "&:hover": {
        color: "primary.main",
      }
    }
  };

  return (
    <Box mb={11}>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "none",
          bgcolor: "white"
        }}
      >
        <Toolbar
          sx={{
            color: "grey.900",
            height: "70px",
            margin: "0 5%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Link to="/">
            <img src={logo} alt="logo" style={{ paddingLeft: 0, maxHeight: "70px", maxWidth: `${isSmallAndUp ? "100%" : "80%"}` }}/>
          </Link>
          <Box onClick={toggleDrawerOpen} pr={0}>
            <AiOutlineMenu size={28} />
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>

      <Drawer
        PaperProps={{
          sx: { width: { xs: "80%", sm: 300  } },
        }}
        anchor="right"
        open={isDrawerOpen}
      >
        <Box sx={{ position: "absolute", right: 0, m: 2 }}>
          <IconButton size="large" onClick={() => setIsDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <div>
          <Box
            sx={{
              pt: 10,
            }}
            onClick={() => setIsDrawerOpen(false)}
          >
            <List
              sx={{ maxWidth: "80%", mx: "auto", textTransform: "uppercase" }}
            >
              {!currentUser ? (
                <>
                  <ListItem onClick={loginModal.onOpen} sx={listItemStyle}>
                    <ListItemText>
                      Login
                    </ListItemText>
                  </ListItem>

                  <ListItem onClick={registerModal.onOpen} sx={listItemStyle}>
                    <ListItemText>
                      Sign up
                    </ListItemText>
                  </ListItem>
                </>
              ) : (
                <>
                  {links.map(({ text, url }, index) => (
                    <Link style={{ all: "unset" }} key={index} to={url}>
                      <ListItem sx={listItemStyle}>
                        <ListItemText>
                          {text}
                        </ListItemText>
                      </ListItem>
                    </Link>
                  ))}
                  <Divider />
                  <ListItem onClick={() => dispatch(logout())} sx={listItemStyle}>
                    <ListItemText>
                      Logout
                    </ListItemText>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </div>
      </Drawer>
    </Box>
  );
};

export default Menu;
