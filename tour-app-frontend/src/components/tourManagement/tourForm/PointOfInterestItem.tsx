import {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  UseFieldArrayRemove,
} from "react-hook-form";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { FieldValues } from "../../../types";
import Input from "../../inputs/Input";
import Textarea from "../../inputs/Textarea";

interface PointOfInterestItemProps {
  index: number;
  register: UseFormRegister<FieldValues<any>>;
  watch: UseFormWatch<FieldValues<any>>;
  errors: FieldErrors<FieldValues<any>>;
  isOperationInProgress: boolean;
  removePOI: UseFieldArrayRemove;
}

const PointOfInterestItem = ({
  index,
  register,
  watch,
  errors,
  isOperationInProgress,
  removePOI,
}: PointOfInterestItemProps) => {
  return (
    <Box mt={2} mb={2}>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography fontWeight="bold">
          Point of Interest {`${index + 1}`}
        </Typography>
        <IconButton
          onClick={() => removePOI(index)}
          color="primary"
          disabled={isOperationInProgress}
        >
          <DeleteForeverIcon />
        </IconButton>
      </Box>
      <Input
        id={`tourPointsOfInterest[${index}].pointOfInterest.name`}
        label={"Name"}
        arrayName="tourPointsOfInterest"
        index={index}
        disabled={isOperationInProgress}
        register={register}
        errors={errors}
        required
      />
      <Textarea
        id={`tourPointsOfInterest[${index}].pointOfInterest.description`}
        label={"Description"}
        arrayName="tourPointsOfInterest"
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
        arrayName="tourPointsOfInterest"
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
  );
};

export default PointOfInterestItem;
