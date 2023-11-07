import { useEffect, useMemo, useState } from "react";
import { Typography, IconButton, Box, Tooltip } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Role, User } from "../../types";
import { ApiError } from "../../utils/ApiError";
import { useAppSelector } from "../../app/reduxHooks";
import toast from "react-hot-toast";
import { createServiceHandler } from "../../utils/serviceHandler";
import userService from "../../services/userService";
import { labelToRole, roleToLabel } from "../../utils/dataProcessing";
import DeleteUserModal from "../modals/DeleteUserModal";
import useDeleteUserModal from "../../hooks/useDeleteUserModal";
import { MRT_ColumnDef, MRT_TableOptions, MaterialReactTable } from "material-react-table";

const UsersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [users, setUsers] = useState<User[]>([]);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const deleteUserModal = useDeleteUserModal();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        size: 100,
        enableEditing: false
      },
      {
        header: "Name",
        accessorKey: "name",
        size: 200,
        enableEditing: false
      },
      {
        header: "Email",
        accessorKey: "email",
        size: 250,
        enableEditing: false
      },
      {
        accessorFn: (originalRow) => roleToLabel(originalRow.role),
        id: "role",
        header: "Role",
        size: 150,
        filterVariant: "select",
        filterSelectOptions: Object.values(Role).map(roleToLabel),
        editVariant: "select",
        editSelectOptions: Object.values(Role).map(roleToLabel),
      },
      {
        accessorFn: (originalRow) => originalRow.active ? "Active" : "Inactive",
        id: "status",
        header: "Status",
        size: 100,
        filterVariant: "select",
        filterSelectOptions: ["Active", "Inactive"],
        editVariant: "select",
        editSelectOptions: ["Active", "Inactive"],
        Cell: ({ row }: { row: { original: User } }) => (
          <Box
            component="span"
            sx={() => ({
              backgroundColor:
                row.original.active
                  ? "rgba(165, 214, 167, 0.4)"
                  : "rgba(239, 154, 154, 0.4)",
              color:
                row.original.active
                  ? "#1b5e20"
                  : "#b71c1c",
              borderRadius: "0.8rem",
              mx: "auto",
              textTransform: "uppercase",
              p: "0.5rem",
            })}
          >
            {row.original.active ? "Active" : "Inactive"}
          </Box>
        ),
      }
    ],
    []
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const getAllUsersHandler = createServiceHandler(userService.getAllUsers, {
        startLoading: () => setIsLoading(true),
        endLoading: () => setIsLoading(false),
      }, { handle: (error: ApiError) => setError(error) });

      const response = await getAllUsersHandler();

      if (response.success && response.data) {
        setUsers(response.data);
        setError(null);
      }
    };

    fetchUsers();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: An error occurred while fetching users.</div>;
  }

  const updateActiveHandler = createServiceHandler(userService.updateActive, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error updating user's active status.");}});

  const handleSaveActiveChange = async (userId: number, editingActiveValue: boolean): Promise<string> => {
    const response = await updateActiveHandler(userId, editingActiveValue);

    if (response.success && response.data) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, active: editingActiveValue } : user
        )
      );
      return "success";
    }

    return "error";
  };

  const updateRoleHandler = createServiceHandler(userService.updateRole, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error updating user's role.");}});

  const handleSaveRoleChange = async (userId: number, editingRoleValue: Role): Promise<string> => {
    const response = await updateRoleHandler(userId, editingRoleValue);

    if (response.success && response.data) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: editingRoleValue } : user
        )
      );
      return "success";
    }

    return "error";
  };

  const handleSaveUser: MRT_TableOptions<User>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {

    if (isUpdating) {
      return;
    }

    const saveActiveResponse = await handleSaveActiveChange(values.id, values.status === "Active");
    const saveRoleResponse = await handleSaveRoleChange(values.id, labelToRole(values.role));

    if (saveActiveResponse === "success" && saveRoleResponse === "success") {
      toast.success("User updated successfully!");
      table.setEditingRow(null);
    }
  };

  const handleDeleteClick = (user: User): void => {
    setUserToDelete(user);
    deleteUserModal.onOpen();
  };

  const handleSuccessfulDelete = (userDeleted: User): void => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userDeleted.id));
  };

  const handleCloseDeleteModal = (): void => {
    setUserToDelete(null);
  };

  return (
    <div>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h1">Users</Typography>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={users}
        enableEditing={true}
        editDisplayMode='row'
        onEditingRowSave={handleSaveUser}
        enableRowActions
        enablePinning
        initialState={{ columnPinning: { right: ["mrt-row-actions"] } }}
        positionActionsColumn="last"
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            }
          }
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton onClick={() => window.open(`mailto:${row.original.email}`)}>
              <MailOutlineIcon />
            </IconButton>
            <Tooltip title="Edit role or status">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => handleDeleteClick(row.original)} color="warning">
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        )}
      />

      {userToDelete &&
        <DeleteUserModal
          userToDelete={userToDelete}
          handleSuccessfulDelete={handleSuccessfulDelete}
          onClose={handleCloseDeleteModal}
        />
      }
    </div>
  );
};

export default UsersPage;
