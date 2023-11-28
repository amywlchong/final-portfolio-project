import { Box, Typography } from "@mui/material";

interface HeadingProps {
  title: string;
  subtitle?: string;
}

const Heading = ({ title, subtitle }: HeadingProps) => {
  return (
    <Box mt={1} mb={1}>
      <Typography>{title}</Typography>
      <Typography>{subtitle}</Typography>
    </Box>
  );
};

export default Heading;
