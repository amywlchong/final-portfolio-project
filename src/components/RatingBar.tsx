import { Favorite } from '@mui/icons-material';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { StyledRating } from "../styles";
import { Typography } from '@mui/material';
import { FieldValues } from '../types';

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
      <label>
        <Typography
          variant="body1"
          component="span"
          style={{ color: hasError ? 'red' : 'inherit' }}
        >
          {label}
        </Typography>
      </label>

      {rating &&
        <StyledRating
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
          <StyledRating
            id={id}
            readOnly={readOnly}
            disabled={disabled}
            value={watch(id)}
            onChange={(_, newValue) => setValue(id, newValue)}
            max={5}
            precision={precision || 0.5}
            icon={<Favorite fontSize="inherit" />}
            emptyIcon={<Favorite style={{ opacity: 0.2 }} fontSize="inherit" />}
          />
        </>
      }
    </div>
  );
}

export default RatingBar;
