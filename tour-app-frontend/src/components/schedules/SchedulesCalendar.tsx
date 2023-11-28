import { useState } from "react";
import { Box, TextField, Tooltip } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { ScheduleResponse } from "../../types";
import { addDays } from "date-fns";

const localizer = momentLocalizer(moment);

interface SchedulesCalendarProps {
  schedules: ScheduleResponse[];
}

const SchedulesCalendar = ({ schedules }: SchedulesCalendarProps) => {
  const [filterGuideName, setFilterGuideName] = useState<string>("");
  const [filterTourName, setFilterTourName] = useState<string>("");

  const getGuideNames = (schedulesGroup: ScheduleResponse[]) =>
    schedulesGroup
      .filter((schedule) => schedule.userName)
      .map((schedule) => schedule.userName)
      .join(", ");

  const filteredSchedules = schedules.filter((schedule) => {
    return (
      (!filterGuideName ||
        schedule.userName
          ?.toLowerCase()
          .includes(filterGuideName.toLowerCase())) &&
      schedule.tourName.toLowerCase().includes(filterTourName.toLowerCase())
    );
  });

  const groupSchedules = (
    schedules: ScheduleResponse[]
  ): Map<string, ScheduleResponse[]> => {
    const grouped: Map<string, ScheduleResponse[]> = new Map();

    schedules.forEach((schedule) => {
      const key = `${schedule.tourId}-${schedule.startDateId}`;
      const group = grouped.get(key);
      if (group) {
        group.push(schedule);
      } else {
        grouped.set(key, [schedule]);
      }
    });

    return grouped;
  };

  const calendarEvents = Array.from(
    groupSchedules(filteredSchedules).values()
  ).map((schedulesGroup) => {
    const firstSchedule = schedulesGroup[0];
    return {
      title: getGuideNames(schedulesGroup)
        ? `${getGuideNames(schedulesGroup)} - ${firstSchedule.tourName}`
        : `Not assigned yet - ${firstSchedule.tourName}`,
      start: new Date(firstSchedule.startDateTime),
      end: addDays(
        new Date(firstSchedule.startDateTime),
        firstSchedule.tourDuration - 1
      ),
      allDay: true,
      resource: firstSchedule,
    };
  });

  const CustomEvent = (props: any) => {
    const { title } = props.event;
    return (
      <Tooltip title={title}>
        <span>{title}</span>
      </Tooltip>
    );
  };

  return (
    <Box style={{ height: "500px" }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Filter by Guide Name"
          value={filterGuideName}
          onChange={(e) => setFilterGuideName(e.target.value)}
        />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Filter by Tour Name"
          value={filterTourName}
          onChange={(e) => setFilterTourName(e.target.value)}
        />
      </Box>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        popup={true}
        components={{
          event: CustomEvent,
        }}
      />
    </Box>
  );
};

export default SchedulesCalendar;
