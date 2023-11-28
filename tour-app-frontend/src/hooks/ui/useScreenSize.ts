import { useTheme, useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const theme = useTheme();
  const is400AndUp = useMediaQuery(theme.breakpoints.up(400));
  const is500AndUp = useMediaQuery(theme.breakpoints.up(500));
  const isSmallAndUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMediumAndUp = useMediaQuery(theme.breakpoints.up("md"));

  return { is400AndUp, is500AndUp, isSmallAndUp, isMediumAndUp };
};

export default useScreenSize;
