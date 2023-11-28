import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FieldValues } from "../../types";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Typography, Rating, InputLabel } from "@mui/material";

interface RatingBarProps {
  id: string;
  label?: string;
  readOnly: boolean;
  disabled?: boolean;
  required?: boolean;
  precision?: number;
  rating?: number | null;
  formMethods?: {
    register: UseFormRegister<FieldValues>;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
  };
  errors?: FieldErrors;
}

const RatingBar = ({
  id,
  label,
  readOnly,
  disabled,
  required,
  precision = 0.5,
  rating,
  formMethods,
  errors,
}: RatingBarProps) => {
  const hasError = errors && errors[id];

  const ratingValue = formMethods ? formMethods.watch(id) : rating;

  return (
    <div>
      {label && (
        <InputLabel htmlFor={id}>
          <Typography variant="body1">{label}</Typography>
        </InputLabel>
      )}

      <Rating
        id={id}
        readOnly={readOnly}
        disabled={disabled}
        value={ratingValue}
        onChange={
          formMethods
            ? (_, newValue) => formMethods.setValue(id, newValue)
            : undefined
        }
        max={5}
        precision={precision}
        icon={<Favorite fontSize="inherit" />}
        emptyIcon={
          hasError ? (
            <FavoriteBorder htmlColor="#D32F2F" fontSize="inherit" />
          ) : readOnly ? (
            <Favorite opacity={0.3} fontSize="inherit" />
          ) : (
            <FavoriteBorder fontSize="inherit" />
          )
        }
      />

      {formMethods && (
        <input type="hidden" {...formMethods.register(id, { required })} />
      )}

      {hasError && (
        <Typography color="#D32F2F" variant="caption" marginLeft="12px">
          {`${label} is required`}
        </Typography>
      )}
    </div>
  );
};

export default RatingBar;
