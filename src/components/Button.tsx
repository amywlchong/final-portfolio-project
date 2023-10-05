import { Button } from "@mui/material";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  icon?: IconType;
  width?: string | number;
}

const ButtonComponent = ({
  label,
  onClick,
  disabled,
  outline,
  icon: Icon,
  width,
}: ButtonProps) => {
  return (
    <Button
      variant={outline ? "outlined" : "contained"}
      disabled={disabled}
      onClick={onClick}
      style={{ width }}
    >
      {label} {Icon && (<Icon style={{ marginLeft: '5px' }} />)}
    </Button>
  );
}

export default ButtonComponent;
