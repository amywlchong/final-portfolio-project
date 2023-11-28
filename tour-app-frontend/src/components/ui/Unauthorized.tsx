import { Box, Typography } from "@mui/material";
import padLock from "../../assets/images/padlock.png";

const Unauthorized = () => {
  return (
    <Box
      sx={{
        mt: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h1">Unauthorized!</Typography>
      <img src={padLock} style={{ maxWidth: "20%" }} />
    </Box>
  );
};

export default Unauthorized;
