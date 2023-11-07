import { useState } from "react";
import { Typography, Box, Table, TableBody, TableRow, TableCell } from "@mui/material";
import toast from "react-hot-toast";
import Button from "../Button";
import personImg from "../../assets/images/person.png";

import { useAppSelector } from "../../app/reduxHooks";
import useUpdatePasswordModal from "../../hooks/useUpdatePasswordModal";
import UpdatePasswordModal from "../modals/UpdatePasswordModal";

import authService from "../../services/authService";
import { useAppDispatch } from "../../app/reduxHooks";
import { createServiceHandler } from "../../utils/serviceHandler";
import { ApiError } from "../../utils/ApiError";
import { logout } from "../../redux/slices/userSlice";
import { roleToLabel } from "../../utils/dataProcessing";

const ProfilePage = () => {
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const updatePasswordModal = useUpdatePasswordModal();

  const [showDeactivationConfirmation, setShowDeactivationConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  const labelStyles = { textAlign: "right", borderBottom: "none", fontSize: "1rem", fontWeight: "bold" };
  const valueStyles = { borderBottom: "none", fontSize: "1rem" };

  const handleDeactivateAccount = () => {
    setShowDeactivationConfirmation(true);
  };

  const handleDeactivationConfirm = async () => {
    const deactivateAccountHandler = createServiceHandler(authService.deactivateAccount, {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
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
          <TableRow>
            <TableCell variant="head" sx={labelStyles}>
                  ID:
            </TableCell>
            <TableCell sx={valueStyles}>
              {currentUser.id}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" sx={labelStyles}>
                  Name:
            </TableCell>
            <TableCell sx={valueStyles}>
              {currentUser.name}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" sx={labelStyles}>
                  Status:
            </TableCell>
            <TableCell sx={valueStyles}>
              {currentUser.active ? "Active" : "Inactive"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" sx={labelStyles}>
                  Role:
            </TableCell>
            <TableCell sx={valueStyles}>
              {roleToLabel(currentUser.role)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box mt={2}>
        <Button
          label="Update Password"
          onClick={updatePasswordModal.onOpen}
          disabled={isLoading}
        />
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        {!showDeactivationConfirmation &&
          <Button
            label="Deactivate Account"
            onClick={handleDeactivateAccount}
            disabled={isLoading}
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
};

export default ProfilePage;
