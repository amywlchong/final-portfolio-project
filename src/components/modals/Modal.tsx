import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

import Button from "../Button";

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
    <Dialog open={isOpen} onClose={handleClose} maxWidth={'xs'} fullWidth={true} >
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton onClick={handleClose}>
            <IoMdClose />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {body}
      </DialogContent>
      <DialogActions>
        <div>
          {secondaryAction && secondaryActionLabel && (
            <Button
              disabled={disabled}
              label={secondaryActionLabel}
              onClick={handleSecondaryAction}
              outline
            />
          )}
          {onSubmit && actionLabel && (
            <Button
              disabled={disabled}
              label={actionLabel}
              onClick={handleSubmit}
            />
          )}
        </div>
      </DialogActions>
      {footer}
    </Dialog>
  );
}

export default Modal;
