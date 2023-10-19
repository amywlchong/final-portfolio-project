import { useState } from 'react';
import { Box, IconButton, Button as MUIButton, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BiSolidImageAdd } from 'react-icons/bi';
import { MdTour } from 'react-icons/md';
import { BsFillCalendar2EventFill } from 'react-icons/bs'
import { useFieldArray, useForm } from 'react-hook-form';
import { Difficulty, FieldValues, Tour, TourImage, TourRequest } from '../../types';
import Input from '../inputs/Input';
import AutocompleteController from '../inputs/AutocompleteController';
import Textarea from '../inputs/Textarea';
import { useAppDispatch, useAppSelector } from '../../app/reduxHooks';
import toast from 'react-hot-toast';
import tourService from '../../services/tourService';
import { createServiceHandler } from '../../utils/serviceHandler';
import { ApiError } from '../../utils/ApiError';
import Button from '../Button';
import { setAllTours } from '../../redux/slices/tourSlice';
import { getSignedImageUrl } from '../../services/aws';

interface TourFormProps {
  tour?: Tour | null;
}

const TourForm = ({ tour }: TourFormProps) => {
  const dispatch = useAppDispatch();
  const existingTours = useAppSelector(state => state.tours.allTours);
  const allRegions = useAppSelector(state => state.tours.allRegions);
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

  const handleDeleteUploadedImage = (index: number) => {
    setUploadedImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleDeleteSavedImage = (index: number) => {
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
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error creating the tour.")}});

  const uploadImagesHandler = createServiceHandler(tourService.uploadTourImages, {
    startLoading: () => setIsOperationInProgress(true),
    endLoading: () => setIsOperationInProgress(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error uploading tour images.")}});

  const deleteImageHandler = createServiceHandler(tourService.deleteTourImage, {
    startLoading: () => setIsOperationInProgress(true),
    endLoading: () => setIsOperationInProgress(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error deleting tour image.")}});

  const updateTourHandler = createServiceHandler(tourService.updateTour, {
    startLoading: () => setIsOperationInProgress(true),
    endLoading: () => setIsOperationInProgress(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error updating the tour.")}});

  const createTourAndUploadImages = async (data: FieldValues<TourRequest>) => {

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

  const updateTourAndImages = async (data: FieldValues<TourRequest>) => {
    if (!tour) {
      toast.error("Error updating tour - tour not provided.");
      return;
    }

    const updateTourResponse = await updateTourHandler(tour.id, data);

    if (updateTourResponse.success && updateTourResponse.data) {
      toast.success("Tour updated successfully");

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

      const updatedTours = existingTours.map(tour => (tour.id === updatedTour.id ? updatedTour : tour));
      dispatch(setAllTours(updatedTours));

      setCurrentTourImages(updatedTour.tourImages || []);
      setUploadedImages([]);
      setImagesToDelete([]);
    }
  };

  const onSubmit = async (data: FieldValues<TourRequest>) => {
    if (tour) {
      updateTourAndImages(data);
    } else {
      createTourAndUploadImages(data);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="name"
        label="Name"
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="duration"
        label="Duration (days)"
        type="number"
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
        fullWidth={false}
        required
      />

      <Input
        id="maxGroupSize"
        label="Max Group Size"
        type="number"
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
        fullWidth={false}
        required
      />

      <AutocompleteController
        id="difficulty"
        control={control}
        rules={{ required: true }}
        defaultValue={Difficulty.Easy}
        label="Difficulty"
        options={Object.values(Difficulty)}
        disabled={isOperationInProgress}
        errors={errors}
        fullWidth={false}
      />

      <Input
        id="price"
        label="Price ($)"
        type="number"
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
        fullWidth={false}
        required
      />

      <Input
        id="summary"
        label="Summary"
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
        required
      />

      <Textarea
        id="description"
        label="Description"
        minRows={5}
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
      />

      <AutocompleteController
        id="region"
        control={control}
        rules={{ required: true }}
        defaultValue={null}
        label="Region"
        options={allRegions}
        freeSolo
        disabled={isOperationInProgress}
        errors={errors}
      />

      <Input
        id="startAddress"
        label="Start Address"
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
        required
      />

      {poiFields.map((field, index) => (
        <Box key={field.id} mt={2} mb={2}>
          <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography fontWeight="bold">Point of Interest {`${index + 1}`}</Typography>
            <IconButton onClick={() => removePOI(index)} color="primary" disabled={isOperationInProgress}>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
          <Input
            id={`tourPointsOfInterest[${index}].pointOfInterest.name`}
            label={`Name`}
            arrayName='tourPointsOfInterest'
            index={index}
            disabled={isOperationInProgress}
            register={register}
            errors={errors}
            required
          />
          <Textarea
            id={`tourPointsOfInterest[${index}].pointOfInterest.description`}
            label={`Description`}
            arrayName='tourPointsOfInterest'
            index={index}
            minRows={5}
            disabled={isOperationInProgress}
            register={register}
            errors={errors}
            required
          />
          <Input
            id={`tourPointsOfInterest[${index}].day`}
            label="Day"
            arrayName='tourPointsOfInterest'
            index={index}
            type="number"
            min={1}
            max={watch("duration")}
            disabled={isOperationInProgress}
            register={register}
            errors={errors}
            fullWidth={false}
          />
        </Box>
      ))}

      {startDateFields.map((field, index) => (
        <Box key={field.id} mt={2} mb={2}>
          <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography fontWeight="bold">Start Date & Time {`${index + 1}`}</Typography>
            <IconButton onClick={() => removeStartDate(index)} color="primary" disabled={isOperationInProgress}>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
          <Input
            id={`tourStartDates[${index}].startDate.startDateTime`}
            label=""
            arrayName='tourStartDates'
            index={index}
            type="datetime-local"
            disabled={isOperationInProgress}
            register={register}
            errors={errors}
            required
          />
        </Box>
      ))}

      <Box mt={2} mb={2} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <label htmlFor="upload-images">
          <input
            id="upload-images"
            type="file"
            multiple
            accept=".jpg"
            style={{ display: 'none' }}
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
            sx={{ marginRight: '10px'}}
          >
            Upload Images
          </MUIButton>
        </label>
        <Button
          label="Add Point of Interest"
          onClick={() => appendPOI({ pointOfInterest: { name: "", description: "" } })}
          outline
          icon={MdTour}
          sx={{ marginRight: '10px'}}
        />
        <Button
          label="Add Start Date"
          onClick={() => appendStartDate({ startDate: { startDateTime: "" } })}
          outline
          icon={BsFillCalendar2EventFill}
          sx={{ marginRight: '10px'}}
        />
      </Box>

      {uploadedImages.length > 0 && (
        <Box mt={2} mb={2}>
          <Typography variant="body2">
            {`Uploaded ${uploadedImages.length} ${uploadedImages.length > 1 ? 'files: ' : 'file: '}`}
            {uploadedImages[0].name}
            {uploadedImages.length > 1 && `, and ${uploadedImages.length - 1} more`}
          </Typography>
        </Box>
      )}

      {uploadedImages.map((image, index) => (
        <Box key={index} display="flex" alignItems="center" mt={2} mb={2}>
          <img src={URL.createObjectURL(image)} alt={`Tour Image ${index + 1}`} width={100} />
          <IconButton
            onClick={() => handleDeleteUploadedImage(index)}
            color="primary"
            disabled={isOperationInProgress}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Box>
      ))}

      {currentTourImages.map((image, index) => (
        <Box key={index} display="flex" alignItems="center" mt={2} mb={2}>
          <img src={getSignedImageUrl(image.imagePath)} alt={`Tour Image ${index + 1}`} width={100} />
          <IconButton
            onClick={() => handleDeleteSavedImage(index)}
            color="primary"
            disabled={isOperationInProgress}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        label={tour ? "Update Tour" : "Create Tour"}
        type="submit"
        disabled={isOperationInProgress}
      />
    </Box>
  );
};

export default TourForm;
