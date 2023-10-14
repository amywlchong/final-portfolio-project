import ModalsProvider from "../providers/ModalsProvider";
import ToasterProvider from "../providers/ToasterProvider";
import ToursPage from "../components/tours/ToursPage";
import Navbar from "../components/navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TourPage from "../components/tours/[tourId]/page";

import { Container } from '@mui/material';
import BookingsPage from "../components/userSelfService/BookingsPage";
import ProfilePage from "../components/userSelfService/ProfilePage";
import UsersPage from "../components/userAdministration/UsersPage";
import SchedulesPage from "../components/schedules/SchedulesPage";

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
            <Route path="/me/bookings" element={<BookingsPage />} />
            <Route path="/me/profile" element={<ProfilePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/tour-guide-schedules" element={<SchedulesPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
