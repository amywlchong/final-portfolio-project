import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/reduxHooks";
import { User } from "../../types";
import { ApiError } from "../../utils/ApiError";
import { createServiceHandler } from "../../utils/serviceHandler";
import userService from "../../services/userService";

export const useUsers = () => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorFetchingUsers, setErrorFetchingUsers] = useState<ApiError | null>(
    null
  );
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useAppSelector((state) => state.user.loggedInUser);

  const fetchUsers = async () => {
    const getAllUsersHandler = createServiceHandler(
      userService.getAllUsers,
      {
        startLoading: () => setIsLoadingUsers(true),
        endLoading: () => setIsLoadingUsers(false),
      },
      { handle: (error: ApiError) => setErrorFetchingUsers(error) }
    );

    const response = await getAllUsersHandler();

    if (response.success && response.data) {
      setUsers(response.data);
      setErrorFetchingUsers(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  return {
    isLoadingUsers,
    errorFetchingUsers,
    users,
    fetchUsers,
    setUsers,
  };
};
