import DateSearchModal from "../components/modals/DateSearchModal";
import LocationSearchModal from "../components/modals/LocationSearchModal";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";

const ModalsProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <LocationSearchModal />
      <DateSearchModal />
    </>
   );
}

export default ModalsProvider;
