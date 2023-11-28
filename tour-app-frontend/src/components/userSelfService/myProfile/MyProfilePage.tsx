import { useState } from "react";
import { Typography, Box, Table, TableBody } from "@mui/material";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import personImg from "../../../assets/images/person.png";
import ProfileTableRow from "./ProfileTableRow";

import { useAppSelector, useAppDispatch } from "../../../app/reduxHooks";
import { useUpdatePasswordModal } from "../../../hooks/modals/useModals";
import UpdatePasswordModal from "../../modals/auth/UpdatePasswordModal";

import authService from "../../../services/authService";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";
import { logout } from "../../../redux/slices/userSlice";
import { roleToLabel } from "../../../utils/dataProcessing";
import { canAccess } from "../../../utils/accessControl";
import { Role } from "../../../types";

const ProfilePage = () => {
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const updatePasswordModal = useUpdatePasswordModal();

  const [showDeactivationConfirmation, setShowDeactivationConfirmation] = useState(false);
  const [isDeactivatingAccount, setIsDeactivatingAccount] = useState(false);
  const dispatch = useAppDispatch();

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  const handleDeactivateAccount = () => {
    setShowDeactivationConfirmation(true);
  };

  const handleDeactivationConfirm = async () => {
    const deactivateAccountHandler = createServiceHandler(authService.deactivateAccount, {
      startLoading: () => setIsDeactivatingAccount(true),
      endLoading: () => setIsDeactivatingAccount(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please try again.");}});

    const response = await deactivateAccountHandler();

    if (response.success && response.data) {
      toast.success("Deactivated account");
      dispatch(logout());
    }
  };

  const handleDeactivationCancel = () => {
    setShowDeactivationConfirmation(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
      <img src={personImg} alt="person" height="250px" />
      <Typography variant="h1">
        My Profile
      </Typography>

      <Table size="small" sx={{ width: "270px" }}>
        <TableBody>
          <ProfileTableRow label="ID:" value={currentUser.id}/>
          <ProfileTableRow label="Name:" value={currentUser.name}/>
          <ProfileTableRow label="Status:" value={currentUser.active ? "Active" : "Inactive"}/>
          <ProfileTableRow label="Role:" value={roleToLabel(currentUser.role)}/>
        </TableBody>
      </Table>

      <Box mt={2}>
        <Button
          label="Update Password"
          onClick={updatePasswordModal.onOpen}
          disabled={isDeactivatingAccount}
        />
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        {!showDeactivationConfirmation && canAccess(currentUser.role, [Role.Customer]) &&
          <Button
            label="Deactivate Account"
            onClick={handleDeactivateAccount}
            disabled={isDeactivatingAccount}
            outline
          />
        }
        {showDeactivationConfirmation && (
          <Box mt={1} mb={1}>
            <Box p={1} sx={{ border: "1px solid #D32F2F" }}>
              <Typography variant="body1" color="#D32F2F">
              Are you sure you want to permanently deactivate your account? You will not be able to log in or use this account again.
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" mt={1} mb={1}>
              <Button sx={{mr: 1}}
                label="Cancel"
                onClick={handleDeactivationCancel}
                disabled={isDeactivatingAccount}
              />
              <Button sx={{ml: 1}}
                label="Confirm"
                onClick={handleDeactivationConfirm}
                disabled={isDeactivatingAccount}
                outline
              />
            </Box>
          </Box>
        )}
      </Box>

      <UpdatePasswordModal />
    </Box>
  );
};

export default ProfilePage;
