import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Box from "@mui/material/Box";

import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { logout } from "../../redux/slices/userSlice";

const UserMenu = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const dispatch = useAppDispatch();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <Box>
      <Box>
        <Box onClick={toggleOpen}>
          <AiOutlineMenu size={28} />
        </Box>
      </Box>
      {isOpen && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'white',
          }}
        >
          <Box>
            {currentUser ? (
              <>
                <Box>
                  My tours
                </Box>
                <Box onClick={() => dispatch(logout())}>
                  Logout
                </Box>
              </>
            ) : (
              <>
                <Box onClick={loginModal.onOpen}>
                  Login
                </Box>
                <Box onClick={registerModal.onOpen}>
                  Sign up
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default UserMenu;
