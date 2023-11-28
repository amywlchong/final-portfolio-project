import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";

import Button from "../ui/Button";
import { Box } from "@mui/material";
import useScreenSize from "../../hooks/ui/useScreenSize";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void | Promise<void>;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel
}: ModalProps) => {
  const { isSmallAndUp } = useScreenSize();
  const [, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    onClose();
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    if (onSubmit) {
      onSubmit();
    }

  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth='xs' fullWidth>

      <IconButton onClick={handleClose} style={{ display: "flex", justifyContent: "flex-end"}}>
        <IoMdClose />
      </IconButton>

      <Box mx={isSmallAndUp ? 2 : 0} mb={2}>
        <DialogTitle textAlign='center'>
          {title}
        </DialogTitle>
        <DialogContent>
          {body}
        </DialogContent>
        <DialogActions>
          {secondaryAction && secondaryActionLabel && onSubmit && actionLabel && (
            <>
              <Button
                disabled={disabled}
                label={secondaryActionLabel}
                onClick={handleSecondaryAction}
                outline
                sx={{ width: "50%"}}
              />
              <Button
                disabled={disabled}
                label={actionLabel}
                onClick={handleSubmit}
                sx={{ width: "50%"}}
              />
            </>
          )}
          {!secondaryAction && !secondaryActionLabel && onSubmit && actionLabel && (
            <Button
              disabled={disabled}
              label={actionLabel}
              onClick={handleSubmit}
              fullWidth
            />
          )}
        </DialogActions>
        {footer}
      </Box>
    </Dialog>
  );
};

export default Modal;
