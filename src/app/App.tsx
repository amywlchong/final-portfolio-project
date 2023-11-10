import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { GlobalStyle } from "../styles";

// Hooks
import { useAppDispatch } from "./reduxHooks";
import { useAuthVerification } from "../hooks/auth/useAuthVerification";

// Redux
import { setUserFromLocalStorage } from "../redux/slices/userSlice";

// Providers
import ModalsProvider from "../providers/ModalsProvider";
import ToasterProvider from "../providers/ToasterProvider";

// Components
import NavBar from "../components/layout/NavigationBar";
import Footer from "../components/layout/Footer";
import DashboardPage from "../components/adminDashboard";
import ToursPage from "../components/tours/ToursPage";
import TourPage from "../components/tours/[tourId]/TourPage";
import MyBookingsPage from "../components/userSelfService/myBookings/MyBookingsPage";
import MyProfilePage from "../components/userSelfService/myProfile/MyProfilePage";
import UsersPage from "../components/userAdministration/UsersPage";
import SchedulesPage from "../components/schedules/SchedulesPage";
import BookingManagementPage from "../components/bookingManagement/BookingsPage";
import TourManagementPage from "../components/tourManagement/ToursPage";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAuthVerification();

  useEffect(() => {
    if (user) {
      dispatch(setUserFromLocalStorage(user));
    }
  }, [user, dispatch]);

  const routes = [
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/", element: <ToursPage /> },
    { path: "/tours/:id", element: <TourPage /> },
    { path: "/me/bookings", element: <MyBookingsPage /> },
    { path: "/me/profile", element: <MyProfilePage /> },
    { path: "/users", element: <UsersPage /> },
    { path: "/tour-guide-schedules", element: <SchedulesPage /> },
    { path: "/bookings", element: <BookingManagementPage /> },
    { path: "/tours", element: <TourManagementPage /> }
  ];

  return (
    <div>
      <GlobalStyle />
      <ToasterProvider />
      <ModalsProvider />

      <Router>
        <NavBar />
        <Container>
          <Routes>
            {routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Container>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
