import React from "react";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

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
    <div>
      <div>
        <div onClick={toggleOpen}>
          <AiOutlineMenu />
        </div>
      </div>
      {isOpen && (
        <div>
          <div>
            {currentUser ? (
              <>
                <div>
                  My tours
                </div>
                <div onClick={() => dispatch(logout())}>
                  Logout
                </div>
              </>
            ) : (
              <>
                <div onClick={loginModal.onOpen}>
                  Login
                </div>
                <div onClick={registerModal.onOpen}>
                  Sign up
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
   );
}

export default UserMenu;
