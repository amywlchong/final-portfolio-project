import { useMemo, useState, useEffect } from "react";
import { useDateFilterModal } from "../../hooks/modals/useModals";
import { Link } from "react-router-dom";
import { Box, Checkbox, IconButton, ListItemText, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { MRT_ColumnDef, MRT_Row, MRT_TableInstance, MRT_TableOptions, MaterialReactTable } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import { ScheduleResponse, ScheduleRequest, GroupedSchedule, User, Role } from "../../types";
import { addDays, format } from "date-fns";
import { formatDateAndTime, isDateWithinRange, labelToRole, labelsToRoles, roleToLabel } from "../../utils/dataProcessing";
import { canAccess } from "../../utils/accessControl";
import { groupSchedules } from "../../utils/schedulesUtils";
import { ApiError } from "../../utils/ApiError";
import { createServiceHandler } from "../../utils/serviceHandler";
import scheduleService from "../../services/scheduleService";
import userService from "../../services/userService";
import DateFilterModal from "../modals/searchFilters/DateFilterModal";
import toast from "react-hot-toast";

interface SchedulesTableProps {
  currentUser: User;
  schedules: ScheduleResponse[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleResponse[]>>;
}

const SchedulesTable = ({ currentUser, schedules, setSchedules }: SchedulesTableProps) => {

  const {
    filterDateRange,
    setFilterDateRange,
    onOpen: onDateFilterModalOpen,
    setType: setDateFilterType,
  } = useDateFilterModal();

  const [isUpdating, setIsUpdating] = useState(false);
  const [availableTourGuides, setAvailableTourGuides] = useState<User[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<User[]>([]);

  useEffect(() => {
    setDateFilterType("future");
  }, []);

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
              onClick={onDateFilterModalOpen}
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

  const filterSchedules = (schedules: ScheduleResponse[]): ScheduleResponse[] =>
    schedules.filter(schedule => {
      return (
        isDateWithinRange(new Date(schedule.startDateTime), filterDateRange)
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
      <MaterialReactTable
        columns={columns}
        data={groupSchedules(filterSchedules(schedules))}
        enableEditing={true}
        editDisplayMode='row'
        onEditingRowSave={handleSaveSchedule}
        enableRowActions={canAccess(currentUser.role, [Role.LeadGuide, Role.Admin])}
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
              <span>
                <IconButton onClick={() => handleEditClick(row, table)} disabled={!canAccess(currentUser.role, [Role.LeadGuide, Role.Admin])}>
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      />

      <DateFilterModal
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
      />
    </>
  );
};

export default SchedulesTable;
