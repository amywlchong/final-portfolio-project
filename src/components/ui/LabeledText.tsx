import { Box, Typography } from "@mui/material";

interface LabeledTextProps {
  label: string;
  value: React.ReactNode;
}

const LabeledText = ({ label, value }: LabeledTextProps) => (
  <Typography variant="body1">
    <Box component="span" sx={{ fontWeight: "bold" }}>{label}:</Box> {value}
  </Typography>
);

export default LabeledText;
