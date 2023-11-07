import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Typography, Rating, InputLabel } from "@mui/material";
import { FieldValues } from "../types";

interface RatingBarProps {
  id: string;
  label?: string;
  readOnly: boolean;
  disabled?: boolean;
  required?: boolean;
  precision?: number;
  rating?: number | null;
  register?: UseFormRegister<FieldValues>;
  watch?:UseFormWatch<FieldValues>;
  setValue?: UseFormSetValue<FieldValues>;
  errors?: FieldErrors;
}

const RatingBar = ({
  id,
  label,
  readOnly,
  disabled,
  required,
  precision,
  rating,
  register,
  watch,
  setValue,
  errors
}: RatingBarProps) => {

  const hasError = errors && errors[id];

  return (
    <div>
      <InputLabel htmlFor={id}>
        <Typography variant="body1">{label}</Typography>
      </InputLabel>

      {rating &&
        <Rating
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          value={rating}
          max={5}
          precision={precision || 0.5}
          icon={<Favorite fontSize="inherit" />}
          emptyIcon={<Favorite style={{ opacity: 0.2 }} fontSize="inherit" />}
        />
      }

      {register && watch && setValue &&
        <>
          <input
            type="hidden"
            {...register(id, { required })}
          />
          <Rating
            id={id}
            readOnly={readOnly}
            disabled={disabled}
            value={watch(id)}
            onChange={(_, newValue) => setValue(id, newValue)}
            max={5}
            precision={precision || 0.5}
            icon={<Favorite fontSize="inherit" />}
            emptyIcon={hasError
              ? <FavoriteBorder htmlColor="#D32F2F" fontSize="inherit" />
              : <FavoriteBorder fontSize="inherit" />
            }
          />
          <Typography color="#D32F2F" variant="caption" marginLeft="12px">{hasError ? `${label} is required` : ""}</Typography>
        </>
      }
    </div>
  );
};

export default RatingBar;
