import { Link as RouterLink } from "react-router-dom";
import { Card } from "@mui/material";
import { styled } from "@mui/system";
import { keyframes } from "@emotion/react";
import { DateRange } from "react-date-range";

export const StyledGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),

  gridTemplateColumns: "1fr",

  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: theme.spacing(3),
  },

  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: theme.spacing(4),
  },
}));

export const StyledLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;

  .MuiCard-root {
    text-decoration: none;
  }
`;

const zoomAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
`;

export const StyledCard = styled(Card)({
  position: "relative",
  width: "100%",
  height: "400px",
  borderRadius: "15px",
  transition: "box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    "& .image-zoom": {
      animation: `${zoomAnimation} 10s`,
    }
  }
});

interface IrregularRectangleProps {
  backgroundImageUrl: string;
}

export const IrregularRectangle = styled("div")<IrregularRectangleProps>(({ backgroundImageUrl }) => ({
  width: "100%",
  height: "65%",
  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 85%)",
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const OverlayText = styled("span")(({ theme }) => ({
  position: "absolute",
  top: "25%",
  left: "50%",
  transform: "translate(-50%)",
  zIndex: 2,
  width: "80%",
  textAlign: "center",
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "white",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(5px)",
  backgroundColor: "rgba(135, 206, 250, 0.8)",
  padding: theme.spacing(0.8, 1),
  borderRadius: "5px",
}));

export const ResponsiveDateRange = styled(DateRange)(({ theme }) => ({
  fontSize: "0.65rem",

  [theme.breakpoints.up(400)]: {
    fontSize: "0.7rem",
  },
  [theme.breakpoints.up(440)]: {
    fontSize: "0.75rem",
  },
  [theme.breakpoints.up(500)]: {
    fontSize: "0.8rem",
  },
}));
