import { Box } from "@mui/material";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../app/reduxHooks";
import { useBookings } from "../../hooks/data/useBookings";
import { useUsers } from "../../hooks/data/useUsers";
import bookingService from "../../services/bookingService";
import BookingChart from "./BookingChart";
import UserList from "./UserList";
import TopTours from "./TopTours";

const DashboardPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const currentUser = useAppSelector((state) => state.user.loggedInUser);

  const { isLoadingBookings, errorFetchingBookings, bookings } = useBookings(
    bookingService.getAllBookings
  );
  const { isLoadingUsers, errorFetchingUsers, users } = useUsers();

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  return (
    <div>
      <Box
        style={{
          display: "flex",
          flexDirection: isSmallAndUp ? "row" : "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BookingChart
          bookings={bookings}
          isLoading={isLoadingBookings}
          error={errorFetchingBookings}
        />
        <UserList
          users={users}
          isLoading={isLoadingUsers}
          error={errorFetchingUsers}
        />
      </Box>
      <TopTours
        bookings={bookings}
        isLoading={isLoadingBookings}
        error={errorFetchingBookings}
      />
    </div>
  );
};

export default DashboardPage;
