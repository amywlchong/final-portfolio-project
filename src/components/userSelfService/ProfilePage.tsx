import { useEffect, useState } from 'react';
import { Role } from '../../types';
import { Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import Button from '../Button';

import { useAppSelector } from '../../app/reduxHooks';
import useUpdatePasswordModal from '../../hooks/useUpdatePasswordModal';
import UpdatePasswordModal from '../modals/UpdatePasswordModal';

import authService from '../../services/authService';
import { useAppDispatch } from "../../app/reduxHooks";
import { createServiceHandler } from '../../utils/serviceHandler';
import { ApiError } from '../../utils/ApiError';
import { logout } from '../../redux/slices/userSlice';

const ProfilePage = () => {
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const updatePasswordModal = useUpdatePasswordModal();

  const [showDeactivationConfirmation, setShowDeactivationConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: '❗' });
      return;
    }

  }, [currentUser]);

  if (!currentUser) {
    return <div>User is not logged in</div>
  }

  const handleDeactivateAccount = () => {
    setShowDeactivationConfirmation(true);
  }

  const handleDeactivationConfirm = async () => {
    const deactivateAccountHandler = createServiceHandler(authService.deactivateAccount, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An unexpected error occurred. Please try again.")}});

    const response = await deactivateAccountHandler();

    if (response.success && response.data) {
      toast.success('Deactivated account');
      dispatch(logout());
    }
  }

  const handleDeactivationCancel = () => {
    setShowDeactivationConfirmation(false);
  }

  const getRoleLabel = (role: Role): string => {
    switch(role) {
      case Role.Customer:
        return 'Customer';
      case Role.Guide:
        return 'Guide';
      case Role.LeadGuide:
        return 'Lead Guide';
      case Role.Admin:
        return 'Admin';
      default:
        return 'Unknown Role';
    }
  }

  return (
    <Box>
      <Typography variant="h1">
        User Profile
      </Typography>

      <Typography variant="body1">
        <Box component="span" sx={{ fontWeight: 'bold' }}>ID:</Box> {currentUser.id}
      </Typography>
      <Typography variant="body1">
        <Box component="span" sx={{ fontWeight: 'bold' }}>Name:</Box> {currentUser.name}
      </Typography>
      <Typography variant="body1">
        <Box component="span" sx={{ fontWeight: 'bold' }}>Status:</Box> {currentUser.active ? 'Active' : 'Inactive'}
      </Typography>
      <Typography variant="body1">
        <Box component="span" sx={{ fontWeight: 'bold' }}>Role:</Box> {getRoleLabel(currentUser.role)}
      </Typography>

      <Box mt={3} mb={3}>
        <Button
          label="Update Password"
          onClick={updatePasswordModal.onOpen}
          disabled={isLoading}
        />
      </Box>

      <Box mt={3} mb={3}>
        <Button
          label="Deactivate Account"
          onClick={handleDeactivateAccount}
          disabled={isLoading}
          outline
        />
        {showDeactivationConfirmation && (
        <Box mt={1} mb={1}>
          <Box bgcolor="red" color="white" p={1} borderRadius={1}>
            <Typography variant="body1">
              Are you sure you want to permanently deactivate your account? You will not be able to log in or use this account again.
            </Typography>
          </Box>
          <Box mt={1} mb={1}>
            <Button sx={{mr: 1}}
              label="Cancel"
              onClick={handleDeactivationCancel}
              disabled={isLoading}
            />
            <Button sx={{ml: 1}}
              label="Confirm"
              onClick={handleDeactivationConfirm}
              disabled={isLoading}
              outline
            />
          </Box>
        </Box>
        )}
      </Box>

      <UpdatePasswordModal />
    </Box>
  );
}

export default ProfilePage;
