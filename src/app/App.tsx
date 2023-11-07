import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { setUserFromLocalStorage } from "../redux/slices/userSlice";

import ModalsProvider from "../providers/ModalsProvider";
import ToasterProvider from "../providers/ToasterProvider";
import ToursPage from "../components/tours/ToursPage";
import Menu from "../components/menu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TourPage from "../components/tours/[tourId]/page";

import { Container } from "@mui/material";
import MyBookingsPage from "../components/userSelfService/MyBookingsPage";
import MyProfilePage from "../components/userSelfService/MyProfilePage";
import UsersPage from "../components/userAdministration/UsersPage";
import SchedulesPage from "../components/schedules/SchedulesPage";
import BookingManagementPage from "../components/bookingManagement/BookingsPage";
import TourManagementPage from "../components/tourManagement/ToursPage";
import { extractTokenAndUser } from "../services/authService";

const App = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    const loggedInUserToken = localStorage.getItem("toursAppLoggedInUserToken");
    const tokenExpiry = localStorage.getItem("toursAppTokenExpiry");

    if (loggedInUserToken && tokenExpiry) {
      const currentTime = Date.now();

      if (currentTime < Number(tokenExpiry)) {
        const { user } = extractTokenAndUser({ token: loggedInUserToken });
        dispatch(setUserFromLocalStorage(user));
      } else {
        localStorage.removeItem("toursAppLoggedInUserToken");
        localStorage.removeItem("toursAppTokenExpiry");
      }
    }
  }, []);

  return (
    <div className="App">
      <ToasterProvider />
      <ModalsProvider />

      <Router>
        <Menu />

        <Container>
          <Routes>
            <Route path="/" element={<ToursPage />} />
            <Route path="/tours/:id" element={<TourPage />} />
            <Route path="/me/bookings" element={<MyBookingsPage />} />
            <Route path="/me/profile" element={<MyProfilePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/tour-guide-schedules" element={<SchedulesPage />} />
            <Route path="/bookings" element={<BookingManagementPage />} />
            <Route path="/tours" element={<TourManagementPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
