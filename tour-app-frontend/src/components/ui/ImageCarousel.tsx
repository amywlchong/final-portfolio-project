import { useState } from "react";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { Box, IconButton, CardMedia } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import flowerImg from "../../assets/images/flower-wide.png";
import { getSignedImageUrl } from "../../services/aws";

interface ImageCarouselProps {
  images: { imagePath: string; coverImage?: boolean }[];
  title: string;
}

const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const { isMediumAndUp } = useScreenSize();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const boxStyle = {
    position: "relative",
    borderRadius: "5px",
    overflow: "hidden",
    width: "100%",
    height: isMediumAndUp ? "350px" : "auto",
    backgroundImage: isMediumAndUp ? `url(${flowerImg})` : "none",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 350px",
  };

  const arrowButtonStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255, 255, 255, 0.6)",
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      setCurrentImageIndex(0); // loop back to the first image
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    } else {
      setCurrentImageIndex(images.length - 1); // loop back to the last image
    }
  };

  // Make sure cover image is first
  const sortedImages = [...images].sort((a) => (a.coverImage ? -1 : 1));

  return (
    <Box sx={boxStyle}>
      <CardMedia
        component="img"
        style={{ maxHeight: "350px", objectFit: "contain", width: "100%" }}
        image={getSignedImageUrl(sortedImages[currentImageIndex].imagePath)}
        title={title}
        alt={title}
      />
      <IconButton
        sx={{ ...arrowButtonStyle, left: isMediumAndUp ? "9%" : 0 }}
        onClick={handlePreviousImage}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton
        sx={{ ...arrowButtonStyle, right: isMediumAndUp ? "9%" : 0 }}
        onClick={handleNextImage}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default ImageCarousel;
