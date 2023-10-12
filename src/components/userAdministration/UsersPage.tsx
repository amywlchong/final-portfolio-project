import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, MenuItem, InputLabel, Select, FormControl, IconButton, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Role, User } from '../../types';
import { ApiError } from '../../utils/ApiError';
import { useAppSelector } from '../../app/reduxHooks';
import toast from 'react-hot-toast';
import { createServiceHandler } from '../../utils/serviceHandler';
import userService from '../../services/userService';
import { labelToRole, roleToLabel } from '../../utils/dataProcessing';
import MultiSelect from '../inputs/MultiSelect';
import DeleteUserModal from '../modals/DeleteUserModal';
import useDeleteUserModal from '../../hooks/useDeleteUserModal';

const UsersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [users, setUsers] = useState<User[]>([]);

  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [filterRoles, setFilterRoles] = useState<string[]>([]);

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingActiveValue, setEditingActiveValue] = useState<boolean | null>(null);
  const [editingRoleValue, setEditingRoleValue] = useState<Role | null>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const deleteUserModal = useDeleteUserModal();

  useEffect(() => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: '❗' });
      return;
    }

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: An error occurred while fetching users.</div>;
  }

  const filteredUsers = users
    .map(user => ({...user, role: roleToLabel(user.role)}))
    .filter(user => {
      return (
        user.id.toString().includes(filterId) &&
        user.name.toLowerCase().includes(filterName.toLowerCase()) &&
        (filterActive === '' || filterActive === (user.active ? 'Active' : 'Inactive')) &&
        (filterRoles.length === 0 || filterRoles.includes(user.role))
      );
    });

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditingActiveValue(user.active);
    setEditingRoleValue(user.role);
  };

  const updateActiveHandler = createServiceHandler(userService.updateActive, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error updating user's active status.")}});

  const handleSaveActiveChange = async (userId: number) => {
    if (editingActiveValue === null) {
      toast.error("Error updating user's active status.");
      return;
    }

    const response = await updateActiveHandler(userId, editingActiveValue);

    if (response.success && response.data) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, active: editingActiveValue } : user
        )
      );
      setEditingUserId(null);
      setEditingActiveValue(null);
      toast.success("User's active status updated successfully!");
    }
  };

  const updateRoleHandler = createServiceHandler(userService.updateRole, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "Error updating user's role.")}});

  const handleSaveRoleChange = async (userId: number) => {
    if (!editingRoleValue) {
      toast.error("Error updating user's role.");
      return;
    }

    const response = await updateRoleHandler(userId, editingRoleValue);

    if (response.success && response.data) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: editingRoleValue } : user
        )
      );
      setEditingUserId(null);
      setEditingRoleValue(null);
      toast.success("User's role updated successfully!");
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    deleteUserModal.onOpen();
  };

  const handleSuccessfulDelete = (userDeleted: User) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userDeleted.id));
  }

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
  };

  return (
    <div>
      <Typography variant="h1">Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: '10px' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Filter by ID"
                  value={filterId}
                  onChange={(e) => setFilterId(e.target.value)}
                />
              </TableCell>
              <TableCell style={{ padding: '10px' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Filter by Name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </TableCell>
              <TableCell style={{ padding: '10px' }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="filterByActiveLabel">Filter by Status</InputLabel>
                  <Select
                    labelId="filterByActiveLabel"
                    label="Filter by Active"
                    value={filterActive}
                    onChange={(event) => setFilterActive(event.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell style={{ padding: '10px' }}>
                <MultiSelect
                  label="Filter by Role"
                  selectedOptions={filterRoles}
                  setSelectedOptions={setFilterRoles}
                  menuItems={Object.values(Role).map(roleValue => (
                    <MenuItem key={roleValue} value={roleToLabel(roleValue)}>
                      {roleToLabel(roleValue)}
                    </MenuItem>
                  ))}
                  formControlSize="small"
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
            <TableCell>
              ID
            </TableCell>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Status
            </TableCell>
            <TableCell>
              Role
            </TableCell>
            <TableCell>
              Edit
            </TableCell>
            <TableCell>
              Delete
            </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.id}
                </TableCell>
                <TableCell>
                  {user.name}
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <>
                      <Select
                        value={editingActiveValue ? 'Active' : 'Inactive'}
                        onChange={(e) => setEditingActiveValue(e.target.value === 'Active')}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                      <Button onClick={() => handleSaveActiveChange(user.id)} disabled={isUpdating}>
                        Save
                      </Button>
                    </>
                  ) : user.active ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <>
                      <Select
                        value={editingRoleValue ? roleToLabel(editingRoleValue) : ""}
                        onChange={(e) => setEditingRoleValue(labelToRole(e.target.value || ""))}
                      >
                        {Object.values(Role).map(role => (
                          <MenuItem key={role} value={roleToLabel(role)}>{roleToLabel(role)}</MenuItem>
                        ))}
                      </Select>
                      <Button onClick={() => handleSaveRoleChange(user.id)} disabled={isUpdating}>
                        Save
                      </Button>
                    </>
                  ) : user.role}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick({...user, role: labelToRole(user.role)})}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteClick({...user, role: labelToRole(user.role)})} color="warning">
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
