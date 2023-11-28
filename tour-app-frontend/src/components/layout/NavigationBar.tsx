import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import TopAppBar from "./TopAppBar";
import NavigationDrawer from "./NavigationDrawer";

const NavBar = () => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((value) => !value);
  }, []);

  return (
    <Box mb={11}>
      <TopAppBar toggleDrawerOpen={toggleDrawerOpen} />
      <NavigationDrawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </Box>
  );
};

export default NavBar;
