import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/reduxHooks";
import { Box, Grid } from "@mui/material";
import { MdTour } from "react-icons/md";
import { BsFillCalendar2EventFill } from "react-icons/bs";
import { FieldValues, Tour, TourImage, TourRequest } from "../../../types";
import { setAllTours } from "../../../redux/slices/tourSlice";
import tourService from "../../../services/tourService";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import TourInfoFields from "./TourInfoFields";
import PointOfInterestItem from "./PointOfInterestItem";
import StartDateItem from "./StartDateItem";
import ImageUploadManager from "./ImageUploadManager";

interface TourFormProps {
  tour?: Tour | null;
}

const TourForm = ({ tour }: TourFormProps) => {
  const dispatch = useAppDispatch();
  const existingTours = useAppSelector(state => state.tours.allTours);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [currentTourImages, setCurrentTourImages] = useState<TourImage[]>(tour?.tourImages || []);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<TourImage[]>([]);

  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: tour || {},
  });

  const { fields: poiFields, append: appendPOI, remove: removePOI } = useFieldArray({
    control,
    name: "tourPointsOfInterest"
  });
  const { fields: startDateFields, append: appendStartDate, remove: removeStartDate } = useFieldArray({
    control,
    name: "tourStartDates"
  });

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  const handleDeleteUploadedImage = (index: number): void => {
    setUploadedImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleDeleteSavedImage = (index: number): void => {
    const imageToDelete = currentTourImages[index];
    if (imageToDelete) {
      setImagesToDelete(prevImages => prevImages.concat(imageToDelete));
      const updatedTourImages = [...currentTourImages];
      updatedTourImages.splice(index, 1);
      setCurrentTourImages(updatedTourImages);
    }
  };

  const createTourHandler = createServiceHandler(tourService.createTour, {
    startLoading: () => setIsOperationInProgress(true),
    endLoading: () => setIsOperationInProgress(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error creating the tour.");}});

  const uploadImagesHandler = createServiceHandler(tourService.uploadTourImages, {
    startLoading: () => setIsOperationInProgress(true),
    endLoading: () => setIsOperationInProgress(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error uploading tour images.");}});

  const deleteImageHandler = createServiceHandler(tourService.deleteTourImage, {
    startLoading: () => setIsOperationInProgress(true),
    endLoading: () => setIsOperationInProgress(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error deleting tour image.");}});

  const updateTourHandler = createServiceHandler(tourService.updateTour, {
    startLoading: () => setIsOperationInProgress(true),
    endLoading: () => setIsOperationInProgress(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error updating the tour.");}});

  const createTourAndUploadImages = async (data: FieldValues<TourRequest>): Promise<void> => {

    const createTourResponse = await createTourHandler(data);

    if (createTourResponse.success && createTourResponse.data) {
      toast.success("Tour created successfully");

      const createdTour = createTourResponse.data;

      if (uploadedImages.length > 0) {
        const uploadImagesResponse = await uploadImagesHandler(createTourResponse.data.id, uploadedImages);

        if (uploadImagesResponse.success && uploadImagesResponse.data) {
          createdTour.tourImages = uploadImagesResponse.data;
        }
      }

      dispatch(setAllTours(existingTours.concat(createdTour)));
    }
  };

  const updateTourAndImages = async (data: FieldValues<TourRequest>): Promise<void> => {
    if (!tour) {
      toast.error("Error updating tour - tour not provided.");
      return;
    }

    const updateTourResponse = await updateTourHandler(tour.id, data);

    if (updateTourResponse.success && updateTourResponse.data) {

      const updatedTour = updateTourResponse.data;

      if (uploadedImages.length > 0) {
        const uploadImagesResponse = await uploadImagesHandler(tour.id, uploadedImages);

        if (uploadImagesResponse.success && uploadImagesResponse.data) {
          updatedTour.tourImages = (updatedTour.tourImages || []).concat(uploadImagesResponse.data);
        }
      }

      let hasShownErrorToast = false;
      for (const imageToDelete of imagesToDelete) {
        const deleteImageResponse = await deleteImageHandler(tour.id, imageToDelete.imageId);

        if (deleteImageResponse.success && deleteImageResponse.data) {
          updatedTour.tourImages = updatedTour.tourImages?.filter(image => image.imageId !== imageToDelete.imageId);
        }

        if (!deleteImageResponse.success && !hasShownErrorToast) {
          toast.error("Error deleting tour image(s).");
          hasShownErrorToast = true;
        }
      }

      toast.success("Tour updated successfully");

      const updatedTours = existingTours.map(tour => (tour.id === updatedTour.id ? updatedTour : tour));
      dispatch(setAllTours(updatedTours));

      setCurrentTourImages(updatedTour.tourImages || []);
      setUploadedImages([]);
      setImagesToDelete([]);
    }
  };

  const onSubmit = async (data: FieldValues<TourRequest>): Promise<void> => {
    if (tour) {
      updateTourAndImages(data);
    } else {
      createTourAndUploadImages(data);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TourInfoFields
        register={register}
        control={control}
        errors={errors}
        isOperationInProgress={isOperationInProgress}
      />

      {poiFields.map((field, index) => (
        <PointOfInterestItem
          key={field.id}
          index={index}
          register={register}
          watch={watch}
          errors={errors}
          isOperationInProgress={isOperationInProgress}
          removePOI={removePOI}
        />
      ))}

      {startDateFields.map((field, index) => (
        <StartDateItem
          key={field.id}
          index={index}
          register={register}
          errors={errors}
          isOperationInProgress={isOperationInProgress}
          removeStartDate={removeStartDate}
        />
      ))}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4} xl={3}>
          <Button
            label="Add Point of Interest"
            onClick={() => appendPOI({ pointOfInterest: { name: "", description: "" } })}
            outline
            icon={MdTour}
            sx={{ marginRight: "10px", width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} md={4} xl={3}>
          <Button
            label="Add Start Date"
            onClick={() => appendStartDate({ startDate: { startDateTime: "" } })}
            outline
            icon={BsFillCalendar2EventFill}
            sx={{ marginRight: "10px", width: "100%" }}
          />
        </Grid>
        <ImageUploadManager
          uploadedImages={uploadedImages}
          currentTourImages={currentTourImages}
          isOperationInProgress={isOperationInProgress}
          setUploadedImages={setUploadedImages}
          handleDeleteUploadedImage={handleDeleteUploadedImage}
          handleDeleteSavedImage={handleDeleteSavedImage}
        />
      </Grid>

      <Box mt={2} mb={2}>
        <Button
          label={tour ? "Update Tour" : "Create Tour"}
          type="submit"
          disabled={isOperationInProgress}
        />
      </Box>
    </Box>
  );
};

export default TourForm;
