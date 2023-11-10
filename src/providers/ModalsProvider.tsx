import DateSearchModal from "../components/modals/searchFilters/DateSearchModal";
import LocationSearchModal from "../components/modals/searchFilters/LocationSearchModal";
import LoginModal from "../components/modals/auth/LoginModal";
import RegisterModal from "../components/modals/auth/RegisterModal";

const ModalsProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <LocationSearchModal />
      <DateSearchModal />
    </>
  );
};

export default ModalsProvider;
