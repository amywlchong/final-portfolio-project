import { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { useAppSelector } from "../../../app/reduxHooks";
import { Box } from "@mui/material";
import { Difficulty, FieldValues } from "../../../types";
import Input from "../../inputs/Input";
import Textarea from "../../inputs/Textarea";
import AutocompleteController from "../../inputs/AutocompleteController";

interface TourInfoFieldsProps {
  register: UseFormRegister<FieldValues<any>>;
  control: Control<FieldValues<any>, any>;
  errors: FieldErrors<FieldValues<any>>;
  isOperationInProgress: boolean;
}

const TourInfoFields = ({ register, control, errors, isOperationInProgress }: TourInfoFieldsProps) => {

  const allRegions = useAppSelector(state => state.tours.allRegions);

  return (
    <Box>
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
        sx={{ width: "210px" }}
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
        label="Location"
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
    </Box>
  );
};

export default TourInfoFields;
