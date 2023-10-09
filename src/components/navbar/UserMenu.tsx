import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Box from "@mui/material/Box";

import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { logout } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";

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
                <Link to={"/me/bookings"}>
                  <Box>
                    My bookings
                  </Box>
                </Link>
                <Box onClick={() => dispatch(logout())} style={{ cursor: 'pointer' }}>
                  Logout
                </Box>
              </>
            ) : (
              <>
                <Box onClick={loginModal.onOpen} style={{ cursor: 'pointer' }}>
                  Login
                </Box>
                <Box onClick={registerModal.onOpen} style={{ cursor: 'pointer' }}>
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
