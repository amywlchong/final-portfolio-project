import { Link } from "react-router-dom";
import routeConfig from "../../config/routeConfig";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { useRegisterModal } from "../../hooks/modals/useModals";
import { useLoginModal } from "../../hooks/modals/useModals";
import { logout } from "../../redux/slices/userSlice";
import { canAccess } from "../../utils/accessControl";

interface NavigationDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: NavigationDrawerProps) => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const currentUser = useAppSelector((state) => state.user.loggedInUser);
  const dispatch = useAppDispatch();

  const listItemStyle = {
    width: "100%",
    cursor: "pointer",
    ".MuiTypography-root": {
      "&:hover": {
        color: "primary.main",
      },
    },
  };

  const allowedLinks = routeConfig
    .filter(
      ({ requiredRoles, showInDrawer }) =>
        showInDrawer &&
        (requiredRoles.length === 0 ||
          (currentUser?.role && canAccess(currentUser?.role, requiredRoles)))
    )
    .map(({ path, text }) => ({ url: path, text }));

  return (
    <Drawer
      PaperProps={{
        sx: { width: { xs: "80%", sm: 300 } },
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
                  <ListItemText>Login</ListItemText>
                </ListItem>

                <ListItem onClick={registerModal.onOpen} sx={listItemStyle}>
                  <ListItemText>Sign up</ListItemText>
                </ListItem>
              </>
            ) : (
              <>
                {allowedLinks.map(({ text, url }, index) => (
                  <Link style={{ all: "unset" }} key={index} to={url}>
                    <ListItem sx={listItemStyle}>
                      <ListItemText>{text}</ListItemText>
                    </ListItem>
                  </Link>
                ))}
                <Divider />
                <ListItem onClick={() => dispatch(logout())} sx={listItemStyle}>
                  <ListItemText>Logout</ListItemText>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
