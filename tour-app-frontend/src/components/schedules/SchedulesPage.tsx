import { useState } from "react";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { useAppSelector } from "../../app/reduxHooks";
import { useSchedules } from "../../hooks/data/useSchedules";
import { Typography, Box } from "@mui/material";
import Button from "../ui/Button";
import SchedulesTable from "./SchedulesTable";
import SchedulesCalendar from "./SchedulesCalendar";

const SchedulesPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const { isLoadingSchedules, errorFetchingSchedules, schedules, setSchedules } = useSchedules();

  const [showCalendar, setShowCalendar] = useState(true);

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  if (isLoadingSchedules) {
    return <div>Loading...</div>;
  }

  if (errorFetchingSchedules) {
    return <div>Error: An error occurred while fetching schedules.</div>;
  }

  return (
    <>
      <Box style={{ display: "flex", flexDirection: `${isSmallAndUp ? "row" : "column"}`, justifyContent: "space-between", alignItems: `${isSmallAndUp ? "center" : "flex-start"}` }}>
        <Typography variant="h1">Tour Guide Schedules</Typography>
        <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Button label={showCalendar ? "Table View" : "Calendar View"} onClick={() => setShowCalendar(prevState => !prevState)} />
        </Box>
      </Box>

      {!showCalendar && (
        <Box mt={2}>
          <SchedulesTable currentUser={currentUser} schedules={schedules} setSchedules={setSchedules} />
        </Box>
      )}

      {showCalendar && (
        <Box mt={2}>
          <SchedulesCalendar schedules={schedules} />
        </Box>
      )}
    </>
  );
};

export default SchedulesPage;
