import { Link as RouterLink } from 'react-router-dom';
import { Card, Rating } from '@mui/material';
import { styled } from '@mui/system';

export const StyledGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),

  // 1 in a row for small screens by default
  gridTemplateColumns: '1fr',

  // 2 in a row for medium screens
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(4),
  },

  // 3 in a row for large screens
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(6),
  },
}));

export const StyledLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;

  .MuiCard-root {
    text-decoration: none;
  }
`;

export const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  height: '400px',
  borderRadius: '15px',
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  }
}));

interface IrregularRectangleProps {
  backgroundImageUrl: string;
}

export const IrregularRectangle = styled('div')<IrregularRectangleProps>(({ backgroundImageUrl }) => ({
  width: '100%',
  height: '65%',
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 85%)',
  backgroundImage: `url("${backgroundImageUrl}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const OverlayText = styled('span')(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'white',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(5px)',
  backgroundColor: 'rgba(135, 206, 250, 0.8)',
  padding: theme.spacing(0.5, 1),
  borderRadius: '5px',
}));

export const StyledRating = styled(Rating)({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  }
});
