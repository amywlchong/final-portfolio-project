import { Button, SxProps, Theme } from "@mui/material";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  outline?: boolean;
  icon?: IconType;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const ButtonComponent = ({
  label,
  onClick,
  type,
  disabled,
  outline,
  icon: Icon,
  fullWidth,
  sx,
}: ButtonProps) => {
  return (
    <Button
      type={type}
      variant={outline ? "outlined" : "contained"}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      sx={sx}
    >
      {label} {Icon && <Icon style={{ marginLeft: "5px" }} />}
    </Button>
  );
};

export default ButtonComponent;
