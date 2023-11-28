import { Card, CardHeader } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { BookingResponse } from "../../types";
import {
  getLastSixMonthsBookings,
  getNumOfBookingsByProperty,
  numOfBookingsByProperty,
} from "../../utils/bookingsUtils";
import { ApiError } from "../../utils/ApiError";

interface BookingChartProps {
  bookings: BookingResponse[];
  isLoading: boolean;
  error: ApiError | null;
}

const BookingChart = ({ bookings, isLoading, error }: BookingChartProps) => {
  const { isSmallAndUp } = useScreenSize();

  const numOfBookingsByMonth: numOfBookingsByProperty<string>[] =
    getNumOfBookingsByProperty(
      getLastSixMonthsBookings(bookings),
      (booking) => booking.monthOfStartDate as string
    );

  let bookingChartContent;
  if (isLoading) {
    bookingChartContent = <div>Loading...</div>;
  } else if (error) {
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

  return (
    <Card style={{ width: isSmallAndUp ? "64%" : "100%" }}>
      <CardHeader title="Number of Bookings in the Last Six Months" />
      {bookingChartContent}
    </Card>
  );
};

export default BookingChart;
