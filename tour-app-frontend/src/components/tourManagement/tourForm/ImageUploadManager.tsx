import { IconButton, Typography, Grid, Button as MUIButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BiSolidImageAdd } from "react-icons/bi";
import { TourImage } from "../../../types";
import { getSignedImageUrl } from "../../../services/aws";

interface ImageUploadManagerProps {
  uploadedImages: File[];
  currentTourImages: TourImage[];
  isOperationInProgress: boolean;
  setUploadedImages: React.Dispatch<React.SetStateAction<File[]>>;
  handleDeleteUploadedImage: (index: number) => void;
  handleDeleteSavedImage: (index: number) => void;
}

const ImageUploadManager = ({ uploadedImages, currentTourImages, isOperationInProgress, setUploadedImages, handleDeleteUploadedImage, handleDeleteSavedImage }: ImageUploadManagerProps) => {

  return (
    <>
      <Grid item xs={12} md={4} xl={3}>
        <label htmlFor="upload-images">
          <input
            id="upload-images"
            type="file"
            multiple
            accept=".jpg"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) {
                setUploadedImages(Array.from(e.target.files));
              }
            }}
          />
          <MUIButton
            component="span"
            variant="outlined"
            endIcon={<BiSolidImageAdd />}
            disabled={isOperationInProgress}
            sx={{ marginRight: "10px", width: "100%" }}
          >
            Upload Images
          </MUIButton>
        </label>
      </Grid>

      {uploadedImages.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="body2">
            {`Uploaded ${uploadedImages.length} ${uploadedImages.length > 1 ? "files: " : "file: "}`}
            {uploadedImages[0].name}
            {uploadedImages.length > 1 && `, and ${uploadedImages.length - 1} more`}
          </Typography>
        </Grid>
      )}

      {uploadedImages.map((image, index) => (
        <Grid item xs={12} display="flex" alignItems="center" key={index}>
          <img src={URL.createObjectURL(image)} alt={`Uploaded Image ${index + 1}`} width={100} />
          <IconButton
            onClick={() => handleDeleteUploadedImage(index)}
            color="primary"
            disabled={isOperationInProgress}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Grid>
      ))}

      {currentTourImages.map((image, index) => (
        <Grid item xs={12} display="flex" alignItems="center" key={index}>
          <img src={getSignedImageUrl(image.imagePath)} alt={`Tour Image ${index + 1}`} width={100} />
          <IconButton
            onClick={() => handleDeleteSavedImage(index)}
            color="primary"
            disabled={isOperationInProgress}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Grid>
      ))}
    </>
  );
};

export default ImageUploadManager;
