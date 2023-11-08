import { useState, useEffect } from "react";
import useScreenSize from "../../hooks/useScreenSize";
import { ApiError } from "../../utils/ApiError";
import { useAppSelector } from "../../app/reduxHooks";
import { createServiceHandler } from "../../utils/serviceHandler";
import bookingService from "../../services/bookingService";
import { Box, Card, CardHeader, CardContent, CardMedia, Typography, Chip, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, IconButton } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import personImg from "../../assets/images/person.png";
import { getMonthFromDateString } from "../../utils/dataProcessing";
import { BookingResponse, Role, User } from "../../types";
import { subMonths } from "date-fns";
import { getSignedImageUrl } from "../../services/aws";
import userService from "../../services/userService";
import { StyledLink } from "../../styles";

export interface numOfBookingsByProperty<T extends string | number | Date> {
  [key: string]: string | number | Date;
  property: T;
  numberOfBookings: number;
}

const getNumOfBookingsByProperty = <T extends string | number | Date>(
  bookings: BookingResponse[],
  groupByKey: (booking: BookingResponse) => T
): numOfBookingsByProperty<T>[] => {
  return bookings.reduce<numOfBookingsByProperty<T>[]>(
    (prev, current) => {
      const keyValue = groupByKey(current);
      const existingEntryIndex = prev.findIndex(entry => entry.property === keyValue);

      if (existingEntryIndex !== -1) {
        prev[existingEntryIndex].numberOfBookings += 1;
      } else {
        keyValue != null && prev.push({ property: keyValue, numberOfBookings: 1 });
      }

      return prev;
    },
    []
  );
};

const DashboardPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const tours = useAppSelector(state => state.tours.filteredTours);

  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorFetchingBookings, setErrorFetchingBookings] = useState<ApiError | null>(null);
  const [errorFetchingUsers, setErrorFetchingUsers] = useState<ApiError | null>(null);

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const getMyBookingsHandler = createServiceHandler(bookingService.getAllBookings, {
        startLoading: () => setIsLoadingBookings(true),
        endLoading: () => setIsLoadingBookings(false),
      }, { handle: (error: ApiError) => setErrorFetchingBookings(error) });

      const response = await getMyBookingsHandler();

      if (response.success && response.data) {
        setBookings(response.data);
        setErrorFetchingBookings(null);
      }
    };

    const fetchUsers = async () => {
      const getAllUsersHandler = createServiceHandler(userService.getAllUsers, {
        startLoading: () => setIsLoadingUsers(true),
        endLoading: () => setIsLoadingUsers(false),
      }, { handle: (error: ApiError) => setErrorFetchingUsers(error) });

      const response = await getAllUsersHandler();

      if (response.success && response.data) {
        setUsers(response.data);
        setErrorFetchingUsers(null);
      }
    };

    fetchBookings();
    fetchUsers();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getLastSixMonthsBookings = (bookings: BookingResponse[]): BookingResponse[] => {
    const sixMonthsAgo = subMonths(new Date(), 6);

    return bookings
      .filter(booking => {
        const bookingDate = new Date(booking.startDateTime);
        const bookingMonth = bookingDate.getMonth();
        const bookingYear = bookingDate.getFullYear();
        return (
          (bookingYear === currentYear && bookingMonth === currentMonth) || // Current month bookings
          (bookingDate >= sixMonthsAgo && bookingDate < new Date()) // Last six months bookings
        );
      })
      .map(booking => {
        return { ...booking, monthOfStartDate: getMonthFromDateString(booking.startDateTime) };
      })
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  };

  const getBookingsThisMonth = (bookings: BookingResponse[]): BookingResponse[] => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startDateTime);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    });
  };

  const numOfBookingsByMonth: numOfBookingsByProperty<string>[] = getNumOfBookingsByProperty(
    getLastSixMonthsBookings(bookings),
    booking => booking.monthOfStartDate as string
  );

  const numOfBookingsByTourId = getNumOfBookingsByProperty(
    getBookingsThisMonth(bookings),
    booking => booking.tourId
  );

  const threeMostBookedTours = numOfBookingsByTourId
    .sort((a, b) => b.numberOfBookings - a.numberOfBookings)
    .slice(0, 3)
    .map(numOfBookingsByTourId => {
      return {numberOfBookings: numOfBookingsByTourId.numberOfBookings, tour: tours.find(tour => tour.id === numOfBookingsByTourId.property)};
    });

  const fiveNewestCustomers = users
    .filter(user => user.role === Role.Customer && user.signupDate !== undefined)
    .sort((a, b) => new Date(b.signupDate as string).getTime() - new Date(a.signupDate as string).getTime())
    .slice(0, 5);

  let bookingChartContent;
  if (isLoadingBookings) {
    bookingChartContent = <div>Loading...</div>;
  } else if (errorFetchingBookings) {
    bookingChartContent = <div>Error fetching data</div>;
  } else if (numOfBookingsByMonth.length > 0) {
    bookingChartContent = (
      <BarChart
        dataset={numOfBookingsByMonth}
        xAxis={[{ scaleType: "band", dataKey: "property", label: "Month" }]}
        series={[{ dataKey: "numberOfBookings" }]}
        title="Number of Bookings in the Last Six Months"
        height={300}
      />
    );
  } else {
    bookingChartContent = <div>No bookings found for the last six months.</div>;
  }

  let userCardContent;
  if (isLoadingUsers) {
    userCardContent = <div>Loading...</div>;
  } else if (errorFetchingUsers) {
    userCardContent = <div>Error fetching data</div>;
  } else if (fiveNewestCustomers.length > 0) {
    userCardContent = (
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {fiveNewestCustomers.map(customer => (
          <Box key={customer.id}>
            <ListItem
              alignItems="center"
              secondaryAction={
                <IconButton onClick={() => window.open(`mailto:${customer.email}`)}>
                  <MailOutlineIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar alt="person" src={personImg} />
              </ListItemAvatar>
              <ListItemText
                primary={customer.name}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Box>
        ))}
      </List>
    );
  } else {
    userCardContent = <div>No customers found.</div>;
  }

  let topToursCardContent;
  if (isLoadingBookings) {
    topToursCardContent = <div>Loading...</div>;
  } else if (errorFetchingBookings) {
    topToursCardContent = <div>Error fetching data</div>;
  } else if (threeMostBookedTours.length > 0) {
    topToursCardContent = (
      threeMostBookedTours.map( (topTour, index) => {
        const coverImage = topTour.tour && Array.isArray(topTour.tour.tourImages)
          ? topTour.tour.tourImages.find(image => image.coverImage) || topTour.tour.tourImages[0]
          : undefined;
        return (
          <StyledLink to={`/tours/${topTour.tour?.id}`} key={index} sx={{ width: isSmallAndUp ? "32%" : "90%", minHeight: "350px", marginTop: isSmallAndUp ? 0 : "10px" }}>
            <Card>
              {coverImage &&
                <CardMedia
                  component="img"
                  height="220px"
                  image={getSignedImageUrl(coverImage.imagePath)}
                  alt={topTour.tour?.name}
                />
              }
              <CardContent>
                <Typography component="div" variant="body1" style={{ display: "flex", flexDirection: "column" }}>
                  {topTour.tour?.name}
                  <Chip label={`${topTour.numberOfBookings} ${topTour.numberOfBookings > 1 ? "bookings" : "booking"}`} variant="outlined" color="primary" style={{ maxWidth: "120px", marginTop: "10px"}}/>
                </Typography>
              </CardContent>
            </Card>
          </StyledLink>
        );
      })
    );
  } else {
    topToursCardContent = <div>No bookings found for this month.</div>;
  }

  return (
    <div>
      <Box style={{ display: "flex", flexDirection: isSmallAndUp ? "row" : "column", justifyContent: "space-between", alignItems: "center" }}>
        <Card style={{ width: isSmallAndUp ? "64%" : "100%" }}>
          <CardHeader
            title="Number of Bookings in the Last Six Months"
          />
          {bookingChartContent}
        </Card>
        <Card style={{ width: isSmallAndUp ? "34%" : "100%", marginTop: isSmallAndUp ? 0 : "20px" }}>
          <CardHeader
            title="New Customers"
          />
          {userCardContent}
        </Card>
      </Box>
      <Card style={{ marginTop: "20px"}}>
        <CardHeader
          title="Best Selling Tours"
          subheader="This month"
        />
        <Box style={{ display: "flex", flexDirection: isSmallAndUp ? "row" : "column", justifyContent: "space-between", alignItems: "center" }}>
          {topToursCardContent}
        </Box>
      </Card>
    </div>
  );

};

export default DashboardPage;
