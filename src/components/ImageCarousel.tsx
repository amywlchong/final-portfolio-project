import { useState } from "react";
import { IconButton, CardMedia } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { getSignedImageUrl } from "../services/aws";

interface ImageCarouselProps {
  images: { imagePath: string, coverImage?: boolean }[];
  title: string;
}

const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);  // loop back to the first image
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1);  // loop back to the last image
    }
  };

  // Make sure cover image is first
  const sortedImages = [...images].sort((a) => (a.coverImage ? -1 : 1));

  return (
    <div style={{ position: "relative", borderRadius: "5px", overflow: "hidden" }}>
      <CardMedia
        component="img"
        style={{ maxHeight: "400px", objectFit: "contain", width: "100%" }}
        image={getSignedImageUrl(sortedImages[currentImageIndex].imagePath)}
        title={title}
        alt={title}
      />
      <IconButton
        style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", background: "rgba(255, 255, 255, 0.6)" }}
        onClick={handlePreviousImage}>
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton
        style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", background: "rgba(255, 255, 255, 0.6)" }}
        onClick={handleNextImage}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
};

export default ImageCarousel;
