import { Link } from "react-router-dom";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { AiOutlineMenu } from "react-icons/ai";
import { AppBar, Box, Divider, Toolbar } from "@mui/material";
import logo from "../../assets/images/logo.png";

interface TopAppBarProps {
  toggleDrawerOpen: () => void;
}

const TopAppBar = ({ toggleDrawerOpen }: TopAppBarProps) => {
  const { isSmallAndUp } = useScreenSize();

  return (
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
  );
};

export default TopAppBar;
