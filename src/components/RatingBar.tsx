import { Favorite } from '@mui/icons-material';
import { Box } from '@mui/material';
import { StyledRating } from '../styles';
import { SyntheticEvent } from 'react';

type BarProps = {
  rating: number | null;
  readOnly: boolean;
  setRating?: React.Dispatch<React.SetStateAction<number | null>>;
};

const RatingBar = ({ rating, readOnly, setRating }: BarProps) => {

  const ratingBarBoxStyles = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start'
  };

  return (
    <Box className="rating-bar" sx={ratingBarBoxStyles}>
        <StyledRating
          readOnly={readOnly}
          value={rating}
          max={5}
          precision={0.5}
          icon={<Favorite fontSize="inherit" />}
          emptyIcon={<Favorite style={{ opacity: 0.2 }} fontSize="inherit" />}
          onChange={setRating
            ? (_event: SyntheticEvent<Element, Event>, newValue: number | null) => setRating(newValue)
            : undefined
          }
        />
    </Box>
  );
};

export default RatingBar;
