import { useState, useEffect, useMemo } from "react";
import { Range } from "react-date-range";
import EditIcon from "@mui/icons-material/Edit";
import { Typography, TextField, MenuItem, Box, Select, Checkbox, ListItemText, Tooltip, IconButton } from "@mui/material";
import { Role, ScheduleRequest, ScheduleResponse, User, GroupedSchedule } from "../../types";
import { formatDateAndTime, labelToRole, labelsToRoles, roleToLabel } from "../../utils/dataProcessing";
import { ApiError } from "../../utils/ApiError";
import { useAppSelector } from "../../app/reduxHooks";
import toast from "react-hot-toast";
import { createServiceHandler } from "../../utils/serviceHandler";
import scheduleService from "../../services/scheduleService";
import DateFilterModal from "../modals/DateFilterModal";
import useDateFilterModal from "../../hooks/useDateFilterModal";
import { addDays, format } from "date-fns";
import SchedulesCalendar from "./SchedulesCalendar";
import Button from "../Button";
import userService from "../../services/userService";
import { MRT_ColumnDef, MRT_Row, MRT_TableInstance, MRT_TableOptions, MaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize";

const SchedulesPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);

  const initialDateRange = {
    startDate: new Date(),
    endDate: addDays(new Date(), 365),
    key: "selection"
  };
  const [filterDateRange, setFilterDateRange] = useState<Range>(initialDateRange);
  const dateFilterModal = useDateFilterModal();

  const [availableTourGuides, setAvailableTourGuides] = useState<User[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<User[]>([]);

  const [showCalendar, setShowCalendar] = useState(true);

  const columns = useMemo<MRT_ColumnDef<GroupedSchedule>[]>(
    () => [
      {
        header: "Guides",
        accessorKey: "userIdsAndNames",
        size: 200,
        Edit: () => {
          return (
            <Select
              multiple
              value={selectedGuides.map(guide => guide.id)}
              onChange={(event) => {
                const selectedIds = event.target.value as number[];
                setSelectedGuides(availableTourGuides.filter(guide => selectedIds.includes(guide.id)));
              }}
              renderValue={(selected: number[]) => (
                selected.map(id => availableTourGuides.find(guide => guide.id === id)?.name || "").join(", ")
              )}
            >
              {availableTourGuides.map(guide => (
                <MenuItem key={guide.id} value={guide.id}>
                  <Checkbox checked={selectedGuides.some(g => g.id === guide.id)} />
                  <ListItemText primary={`${guide.name} (ID: ${guide.id}, ${roleToLabel(guide.role)})`} />
                </MenuItem>
              ))}
            </Select>
          );
        },
      },
      {
        header: "Roles",
        accessorKey: "userRoles",
        size: 150,
        filterVariant: "select",
        filterSelectOptions: ["Guide", "Lead Guide"],
        filterFn: (row, id, filterValue) =>
          typeof row.getValue(id) === "string" && labelsToRoles(row.getValue(id) as string).includes(labelToRole(filterValue)),
        enableEditing: false
      },
      {
        header: "Tour Name",
        accessorKey: "tourName",
        size: 200,
        Cell: ({ row }: { row: { original: GroupedSchedule } }) => (
          <Link to={`/tours/${row.original.tourId}`}>
            {row.original.tourName}
          </Link>
        ),
        enableEditing: false
      },
      {
        header: "Location",
        accessorKey: "tourRegion",
        size: 150,
        enableEditing: false
      },
      {
        accessorFn: (originalRow) => formatDateAndTime(originalRow.startDateTime),
        id: "startDateTime",
        header: "Start Date & Time",
        size: 180,
        Filter: () => {
          return (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Filter by Start Date"
              value=""
              onClick={dateFilterModal.onOpen}
            />
          );
        },
        enableEditing: false
      },
      {
        header: "Duration (days)",
        accessorKey: "tourDuration",
        size: 100,
        filterVariant: "range",
        enableEditing: false
      }
    ],
    [availableTourGuides, selectedGuides]
  );

  useEffect(() => {
    const fetchSchedules = async () => {
      const getAllSchedulesHandler = createServiceHandler(scheduleService.getAllSchedules, {
        startLoading: () => setIsLoading(true),
        endLoading: () => setIsLoading(false),
      }, { handle: (error: ApiError) => setError(error) });

      const response = await getAllSchedulesHandler();

      if (response.success && response.data) {
        setSchedules(response.data.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()));
        setError(null);
      }
    };

    fetchSchedules();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: An error occurred while fetching schedules.</div>;
  }

  const groupSchedules = (schedules: ScheduleResponse[]): GroupedSchedule[] => {
    const grouped: { [key: string]: ScheduleResponse[] } = {};

    // Group by tourId and startDateId
    schedules.forEach(schedule => {
      const key = `${schedule.tourId}-${schedule.startDateId}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(schedule);
    });

    return Object.values(grouped).map(group => ({
      ids: group.map(s => s.id).filter(Boolean).join(", "),

      userIds: group.map(s => s.userId).filter(Boolean).join(", "),
      userIdsAndNames: group.map(s => {
        if (s.userName && s.userId) {
          return `${s.userName} (id: ${s.userId})`;
        }
        return null;
      }).filter(Boolean).join(", "),
      userRoles: Array.from(
        new Set(group.map(s => s.userRole)
          .filter(Boolean)
          .map(role => roleToLabel(role as Role)))
      ).join(", "),

      tourId: group[0].tourId,
      tourName: group[0].tourName,
      tourDuration: group[0].tourDuration,
      tourRegion: group[0].tourRegion,
      startDateId: group[0].startDateId,
      startDateTime: group[0].startDateTime
    }));
  };

  const isScheduleDateWithinRange = (scheduleDate: Date): boolean => {
    let filterStartDate: Date | undefined, filterEndDate: Date | undefined;
    if (filterDateRange.startDate) {
      filterStartDate = new Date(filterDateRange.startDate);
    }
    if (filterDateRange.endDate) {
      filterEndDate = new Date(filterDateRange.endDate);
      filterEndDate.setHours(23, 59, 59, 999);
    }

    if (filterStartDate && scheduleDate.getTime() < filterStartDate.getTime()) {
      return false;
    }
    if (filterEndDate && scheduleDate.getTime() > filterEndDate.getTime()) {
      return false;
    }
    return true;
  };

  const filterSchedules = (schedules: ScheduleResponse[]): ScheduleResponse[] =>
    schedules.filter(schedule => {
      return (
        isScheduleDateWithinRange(new Date(schedule.startDateTime))
      );
    });

  const handleEditClick = async (row: MRT_Row<GroupedSchedule>, table: MRT_TableInstance<GroupedSchedule>): Promise<void> => {
    table.setEditingRow(row);
    const {tourId, tourDuration, startDateTime} = row.original;

    try {
      const formattedStartDate = format(new Date(startDateTime), "yyyy-MM-dd");
      const formattedEndDate = format(addDays(new Date(startDateTime), (tourDuration - 1)), "yyyy-MM-dd");
      const availableGuidesWithinRange = await userService.getAvailableGuidesWithinRange(formattedStartDate, formattedEndDate);

      const originalSchedules = schedules.filter(schedule => schedule.tourId === tourId && schedule.startDateTime === startDateTime);

      const originalGuides: User[] = originalSchedules
        .filter(schedule => schedule.userId && schedule.userName && schedule.userActive && schedule.userRole)
        .map(schedule => ({
          id: schedule.userId as number,
          name: schedule.userName as string,
          active: schedule.userActive as boolean,
          role: schedule.userRole as Role
        }));

      setSelectedGuides(originalGuides);

      const mergedGuides =[...availableGuidesWithinRange, ...originalGuides];

      setAvailableTourGuides(mergedGuides);
    } catch (error: any) {
      console.error("Error handling edit click:", error.response?.data);
      toast.error(error.response?.data || "An unexpected error occurred. Please try again.");
    }
  };

  const createScheduleHandler = createServiceHandler(scheduleService.createSchedule, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An error occurred while adding guide to schedule.");}});

  const deleteScheduleHandler = createServiceHandler(scheduleService.deleteSchedule, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An error occurred while deleting schedule for guide.");}});

  const handleSaveSchedule: MRT_TableOptions<GroupedSchedule>["onEditingRowSave"] = async ({
    row,
    table,
  }) => {

    if (isUpdating) {
      return;
    }

    const originalScheduleIds = row.original.ids.split(", ");
    const originalGuideIds = row.original.userIds.split(", ");
    const selectedGuideIds = selectedGuides.map(guide => guide.id);

    const guideIdsToAdd = selectedGuideIds.filter(id => !originalGuideIds.includes(id.toString()));
    const guideIdsToDelete = originalGuideIds.filter(id => !isNaN(Number(id)) && !selectedGuideIds.includes(Number(id)));
    const scheduleIdsToDelete = schedules
      .filter(schedule =>
        schedule.id &&
        originalScheduleIds.includes(schedule.id.toString()) &&
        schedule.userId &&
        guideIdsToDelete.includes(schedule.userId.toString()))
      .map(schedule => schedule.id);

    const updatedSchedules = [...schedules];

    for (const guideIdToAdd of guideIdsToAdd) {
      const newSchedule: ScheduleRequest = {
        userId: guideIdToAdd,
        tourId: row.original.tourId,
        startDateTime: row.original.startDateTime,
      };
      const response = await createScheduleHandler(newSchedule);
      if (response.success && response.data) {
        updatedSchedules.push(response.data);
      }
    }

    for (const scheduleIdToDelete of scheduleIdsToDelete) {
      if (scheduleIdToDelete === undefined) {
        toast.error("An error occurred while deleting a schedule.");
        console.error("Error deleting schedule: undefined schedule id");
        return;
      }
      const response = await deleteScheduleHandler(scheduleIdToDelete);
      if (response.success && response.data) {
        const index = updatedSchedules.findIndex(s => s.id === scheduleIdToDelete);
        if (index !== -1) {
          updatedSchedules[index].userId = undefined;
          updatedSchedules[index].userName = undefined;
          updatedSchedules[index].userActive = undefined;
          updatedSchedules[index].userRole = undefined;
        }
      }
    }

    setSchedules(_prevSchedules => updatedSchedules);

    toast.success("Schedule updated successfully.");
    table.setEditingRow(null);
    setSelectedGuides([]);
  };

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
          <MaterialReactTable
            columns={columns}
            data={groupSchedules(filterSchedules(schedules))}
            enableEditing={true}
            editDisplayMode='row'
            onEditingRowSave={handleSaveSchedule}
            enableRowActions
            enablePinning
            initialState={{ columnPinning: { right: ["mrt-row-actions"] } }}
            positionActionsColumn="last"
            displayColumnDefOptions={{
              "mrt-row-actions": {
                muiTableHeadCellProps: {
                  align: "left",
                }
              }
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
                <Tooltip title="Edit guide">
                  <IconButton onClick={() => handleEditClick(row, table)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </Box>
      )}

      {showCalendar && (
        <Box mt={2}><SchedulesCalendar schedules={schedules} /></Box>
      )}

      <DateFilterModal
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
      />
    </>
  );
};

export default SchedulesPage;
