import ModalsProvider from "../providers/ModalsProvider";
import ToasterProvider from "../providers/ToasterProvider";
import ToursPage from "../components/tours/ToursPage";
import Navbar from "../components/navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TourPage from "../components/tours/[tourId]/page";

import { Container } from '@mui/material';
import MyBookingsPage from "../components/userSelfService/MyBookingsPage";
import MyProfilePage from "../components/userSelfService/MyProfilePage";
import UsersPage from "../components/userAdministration/UsersPage";
import SchedulesPage from "../components/schedules/SchedulesPage";
import BookingManagementPage from "../components/bookingManagement/BookingsPage";
import TourManagementPage from "../components/tourManagement/ToursPage";

const App = () => {
  return (
    <div className="App">
      <ToasterProvider />
      <ModalsProvider />

      <Router>
        <Navbar />

        <Container maxWidth={'lg'}>
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
}

export default App;
