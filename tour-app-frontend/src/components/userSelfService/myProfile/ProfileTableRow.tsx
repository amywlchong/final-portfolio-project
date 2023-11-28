import { TableRow, TableCell } from "@mui/material";

type ProfileTableRowProps = {
  label: string;
  value: string | number;
};

const ProfileTableRow = ({ label, value }: ProfileTableRowProps) => {
  const labelStyles = {
    textAlign: "right",
    borderBottom: "none",
    fontSize: "1rem",
    fontWeight: "bold",
  };
  const valueStyles = { borderBottom: "none", fontSize: "1rem" };

  return (
    <TableRow>
      <TableCell variant="head" sx={labelStyles}>
        {label}
      </TableCell>
      <TableCell sx={valueStyles}>{value}</TableCell>
    </TableRow>
  );
};

export default ProfileTableRow;
