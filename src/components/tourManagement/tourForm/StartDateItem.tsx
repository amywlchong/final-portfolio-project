import { UseFormRegister, FieldErrors, UseFieldArrayRemove } from "react-hook-form";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { FieldValues } from "../../../types";
import Input from "../../inputs/Input";

interface StartDateItemProps {
  index: number;
  register: UseFormRegister<FieldValues<any>>
  errors: FieldErrors<FieldValues<any>>;
  isOperationInProgress: boolean;
  removeStartDate: UseFieldArrayRemove;
}

const StartDateItem = ({ index, register, errors, isOperationInProgress, removeStartDate }: StartDateItemProps) => {

  return (
    <Box mt={2} mb={2}>
      <Box style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
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
  );
};

export default StartDateItem;
