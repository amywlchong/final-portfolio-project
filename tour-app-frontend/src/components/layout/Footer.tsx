import useScreenSize from "../../hooks/ui/useScreenSize";
import { Box, Container, Typography, Link } from "@mui/material";

const Footer = () => {
  const { isSmallAndUp } = useScreenSize();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f7f7f7",
        width: "100%",
        marginTop: "40px",
        padding: "20px 0",
      }}
    >
      <Container>
        <Typography variant="h6">Scenic Symphony Tours</Typography>
        <Typography variant="subtitle1">
          Discover your next adventure
        </Typography>

        <Box display="flex" flexDirection={isSmallAndUp ? "row" : "column"}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Scenic Symphony Tours, Inc. All rights
            reserved.
          </Typography>
          <Typography variant="body2" sx={{ pl: isSmallAndUp ? 1 : 0 }}>
            <Link href="#" color="inherit">
              Privacy Policy
            </Link>
            {" | "}
            <Link href="#" color="inherit">
              Terms of Use
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
