import { Button, SxProps, Theme } from "@mui/material";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  outline?: boolean;
  icon?: IconType;
  width?: string | number;
  sx?: SxProps<Theme>;
}

const ButtonComponent = ({
  label,
  onClick,
  type,
  disabled,
  outline,
  icon: Icon,
  width,
  sx
}: ButtonProps) => {
  return (
    <Button
      type={type}
      variant={outline ? "outlined" : "contained"}
      disabled={disabled}
      onClick={onClick}
      style={{ width }}
      sx={sx}
    >
      {label} {Icon && (<Icon style={{ marginLeft: '5px' }} />)}
    </Button>
  );
}

export default ButtonComponent;
