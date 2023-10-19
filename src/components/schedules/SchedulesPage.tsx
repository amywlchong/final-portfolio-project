import { useState, useEffect } from 'react';
import { Range } from 'react-date-range';
import EditIcon from '@mui/icons-material/Edit';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, MenuItem, Box, Select, Checkbox, ListItemText } from '@mui/material';
import { Role, ScheduleRequest, ScheduleResponse, User } from '../../types';
import { formatDateAndTime, roleToLabel } from '../../utils/dataProcessing';
import { ApiError } from '../../utils/ApiError';
import { useAppSelector } from '../../app/reduxHooks';
import toast from 'react-hot-toast';
import { createServiceHandler } from '../../utils/serviceHandler';
import scheduleService from '../../services/scheduleService';
import MultiSelect from '../inputs/MultiSelect';
import DateFilterModal from '../modals/DateFilterModal';
import useDateFilterModal from '../../hooks/useDateFilterModal';
import { addDays, format } from 'date-fns';
import SchedulesCalendar from './SchedulesCalendar';
import Button from '../Button';
import { BiSolidSave } from 'react-icons/bi';
import userService from '../../services/userService';
import { Link } from "react-router-dom";

const SchedulesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useAppSelector(state => state.user.loggedInUser);

  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);

  const [showFilters, setShowFilters] = useState(false);
  const [filterGuideNameOrId, setFilterGuideNameOrId] = useState<string>('');
  const [filterGuideRole, setFilterGuideRole] = useState<string[]>([]);
  const [filterTourName, setFilterTourName] = useState<string>('');
  const [filterTourRegion, setFilterTourRegion] = useState<string>('');
  const [filterTourDuration, setFilterTourDuration] = useState<string>('');

  const initialDateRange = {
    startDate: new Date(),
    endDate: addDays(new Date(), 365),
    key: 'selection'
  };
  const [filterDateRange, setFilterDateRange] = useState<Range>(initialDateRange);
  const dateFilterModal = useDateFilterModal();

  const [editingTourId, setEditingTourId] = useState<number | null>(null);
  const [editingStartDateTime, setEditingStartDateTime] = useState<string | null>(null);
  const [availableTourGuides, setAvailableTourGuides] = useState<User[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<User[]>([]);

  const [showCalendar, setShowCalendar] = useState(false);

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

  const groupSchedules = (schedules: ScheduleResponse[]): Map<string, ScheduleResponse[]> => {
    const grouped: Map<string, ScheduleResponse[]> = new Map();

    schedules.forEach(schedule => {
      const key = `${schedule.tourId}-${schedule.startDateId}`;
      const group = grouped.get(key);
      if (group) {
        group.push(schedule);
      } else {
        grouped.set(key, [schedule]);
      }
    });

    if (filterGuideRole.includes(roleToLabel(Role.Guide)) && filterGuideRole.includes(roleToLabel(Role.LeadGuide))) {
      grouped.forEach((group, key) => {
        const rolesInGroup = group.map(schedule => schedule.userRole).filter(Boolean);
        if (!(rolesInGroup.includes(Role.Guide) && rolesInGroup.includes(Role.LeadGuide))) {
          grouped.delete(key);
        }
      });
    }

    return grouped;
  };

  const getNamesAndIds = (schedulesGroup: ScheduleResponse[]) =>
    schedulesGroup
      .filter(schedule => schedule.userId && schedule.userName)
      .map(schedule => `${schedule.userName} (ID: ${schedule.userId})`)
      .join(',\n').split('\n').map((item, index) => <span key={index}>{item}<br /></span>);

  const getRoles = (schedulesGroup: ScheduleResponse[]) => {
    const rolesSet = new Set(
      schedulesGroup.map(schedule =>
        schedule.userRole ? roleToLabel(schedule.userRole) : null
      ).filter(Boolean)
    );

    return Array.from(rolesSet).join(',\n').split('\n').map((item, index) => <span key={index}>{item}<br /></span>);
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
  }

  const filteredSchedules = schedules.filter(schedule => {
    return (
      ((!filterGuideNameOrId) ||
      (schedule.userName?.toLowerCase().includes(filterGuideNameOrId.toLowerCase()) ||
        schedule.userId?.toString().includes(filterGuideNameOrId))) &&
      (filterGuideRole.length === 0 || filterGuideRole.includes(schedule.userRole ? roleToLabel(schedule.userRole) : "unknown")) &&
      schedule.tourName.toLowerCase().includes(filterTourName.toLowerCase()) &&
      schedule.tourRegion.toLowerCase().includes(filterTourRegion.toLowerCase()) &&
      isScheduleDateWithinRange(new Date(schedule.startDateTime)) &&
      schedule.tourDuration.toString().includes(filterTourDuration)
    );
  });

  const handleEditClick = async (tourId: number, tourDuration: number, startDateTime: string) => {
    try {
      const formattedStartDate = format(new Date(startDateTime), 'yyyy-MM-dd');
      const formattedEndDate = format(addDays(new Date(startDateTime), (tourDuration - 1)), 'yyyy-MM-dd');
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
      setEditingTourId(tourId);
      setEditingStartDateTime(startDateTime);
    } catch (error: any) {
      console.error("Error handling edit click:", error.response?.data)
      toast.error(error.response?.data || "An unexpected error occurred. Please try again.");
    }
  };

  const createScheduleHandler = createServiceHandler(scheduleService.createSchedule, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An error occurred while adding guide to schedule.")}});

  const deleteScheduleHandler = createServiceHandler(scheduleService.deleteSchedule, {
    startLoading: () => setIsUpdating(true),
    endLoading: () => setIsUpdating(false),
  }, { handle: (error: ApiError) => { toast.error(error.response?.data || "An error occurred while deleting schedule for guide.")}});

  const handleSaveGuideChange = async (tourId: number, startDateTime: string, originalSchedules: ScheduleResponse[]) => {
    const originalGuideIds = originalSchedules.map(schedule => schedule.userId);
    const selectedGuideIds = selectedGuides.map(guide => guide.id);

    const guidesToAdd = selectedGuides.filter(guide => !originalGuideIds.includes(guide.id));
    const schedulesToDelete = originalSchedules.filter(schedule => schedule.userId && !selectedGuideIds.includes(schedule.userId));

    const updatedSchedules = [...schedules];

    for (const guideToAdd of guidesToAdd) {
      const newSchedule: ScheduleRequest = {
        userId: guideToAdd.id,
        tourId,
        startDateTime,
      };
      const response = await createScheduleHandler(newSchedule);
      if (response.success && response.data) {
        updatedSchedules.push(response.data);
      }
    }

    for (const scheduleToDelete of schedulesToDelete) {
      if (!scheduleToDelete.id) {
        throw new Error();
      }

      const response = await deleteScheduleHandler(scheduleToDelete.id);
      if (response.success && response.data) {
        const index = updatedSchedules.findIndex(s => s.id === scheduleToDelete.id);
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
    setEditingTourId(null);
    setEditingStartDateTime(null);
    setSelectedGuides([]);
  };

  const renderTableFilters = () => {
    return (
      <TableRow>
        <TableCell style={{ width: '5%' }}></TableCell>
        <TableCell style={{ width: '20%', padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Name or ID"
            value={filterGuideNameOrId}
            onChange={(e) => setFilterGuideNameOrId(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ width: '10%', padding: '10px', borderRight: '1px solid rgba(200, 200, 200, 1)' }}>
          <MultiSelect
            label="Filter by Role"
            selectedOptions={filterGuideRole}
            setSelectedOptions={setFilterGuideRole}
            menuItems={[Role.Guide, Role.LeadGuide].map(roleValue => (
              <MenuItem key={roleValue} value={roleToLabel(roleValue)}>
                {roleToLabel(roleValue)}
              </MenuItem>
            ))}
            formControlSize="small"
          />
        </TableCell>
        <TableCell style={{ width: '20%', padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Name"
            value={filterTourName}
            onChange={(e) => setFilterTourName(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ width: '20%', padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Location"
            value={filterTourRegion}
            onChange={(e) => setFilterTourRegion(e.target.value)}
          />
        </TableCell>
        <TableCell style={{ width: '20%', padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Start Date"
            value=""
            onClick={dateFilterModal.onOpen}
          />
        </TableCell>
        <TableCell style={{ width: '5%', padding: '10px' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter by Duration"
            value={filterTourDuration}
            onChange={(e) => setFilterTourDuration(e.target.value)}
          />
        </TableCell>
      </TableRow>
    )
  };

  const renderTableHeaders = () => {
    return (
      <TableRow>
        <TableCell style={{ width: '5%' }}>Edit</TableCell>
        <TableCell style={{ width: '20%' }}>Name & ID</TableCell>
        <TableCell style={{ width: '10%', borderRight: '1px solid rgba(200, 200, 200, 1)' }}>Role</TableCell>
        <TableCell style={{ width: '20%' }}>Name</TableCell>
        <TableCell style={{ width: '20%' }}>Location</TableCell>
        <TableCell style={{ width: '20%' }}>Start Date & Time</TableCell>
        <TableCell style={{ width: '5%' }}>Duration (days) </TableCell>
      </TableRow>
    )
  };

  const renderTableRows = () => {
    return (
      <>
        {Array.from(groupSchedules(filteredSchedules).values()).map(schedulesGroup => {
          const firstSchedule = schedulesGroup[0];
          return (
            <TableRow key={`${firstSchedule.tourId}-${firstSchedule.startDateId}`}>
              <TableCell style={{ width: '5%' }}>
                <EditIcon
                  onClick={() => handleEditClick(firstSchedule.tourId, firstSchedule.tourDuration, firstSchedule.startDateTime)}
                  style={{ cursor: 'pointer'}}
                />
              </TableCell>
              <TableCell style={{ width: '20%' }}>
              {editingTourId === firstSchedule.tourId && editingStartDateTime === firstSchedule.startDateTime ? (
                <>
                  <Select
                    multiple
                    value={selectedGuides.map(guide => guide.id)}
                    onChange={(event) => {
                      const selectedIds = event.target.value as number[];
                      setSelectedGuides(availableTourGuides.filter(guide => selectedIds.includes(guide.id)));
                    }}
                    renderValue={(selected: number[]) => (
                      selected.map(id => availableTourGuides.find(guide => guide.id === id)?.name || '').join(', ')
                    )}
                  >
                    {availableTourGuides.map(guide => (
                      <MenuItem key={guide.id} value={guide.id}>
                        <Checkbox checked={selectedGuides.some(g => g.id === guide.id)} />
                        <ListItemText primary={`${guide.name} (ID: ${guide.id}, ${roleToLabel(guide.role)})`} />
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    label="Save"
                    onClick={() => handleSaveGuideChange(firstSchedule.tourId, firstSchedule.startDateTime, schedulesGroup)}
                    icon={BiSolidSave}
                    disabled={isUpdating}
                  />
                </>
              ) : (
                getNamesAndIds(schedulesGroup)
              )}
              </TableCell>
              <TableCell style={{ width: '10%', borderRight: '1px solid rgba(200, 200, 200, 1)' }}>{getRoles(schedulesGroup)}</TableCell>
              <TableCell style={{ width: '20%' }}>
                <Link to={`/tours/${firstSchedule.tourId}`}>
                  {firstSchedule.tourName}
                </Link>
              </TableCell>
              <TableCell style={{ width: '20%' }}>{firstSchedule.tourRegion}</TableCell>
              <TableCell style={{ width: '20%' }}>{formatDateAndTime(firstSchedule.startDateTime)}</TableCell>
              <TableCell style={{ width: '5%' }}>{firstSchedule.tourDuration}</TableCell>
            </TableRow>
          );
        })}
      </>
    )
  };

  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1">Tour Guide Schedules</Typography>
        <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {!showCalendar && <Button label={showFilters ? "Hide Filters" : "Show Filters"} onClick={() => setShowFilters(prevState => !prevState)} outline sx={{marginRight: 2}} />}
          <Button label={showCalendar ? "Table View" : "Calendar View"} onClick={() => setShowCalendar(prevState => !prevState)} />
        </Box>
      </Box>
      {!showCalendar && (
        <TableContainer component={Paper} style={{ width: '100%'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} style={{ borderRight: '1px solid rgba(200, 200, 200, 1)' }}>
                  <Typography variant="subtitle1" align="center">
                    Guide
                  </Typography>
                </TableCell>
                <TableCell colSpan={4}>
                  <Typography variant="subtitle1" align="center">
                    Tour
                  </Typography>
                </TableCell>
              </TableRow>
                {showFilters && renderTableFilters()}
                {renderTableHeaders()}
            </TableHead>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showCalendar && (
        <SchedulesCalendar schedules={schedules} />
      )}

      <DateFilterModal
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
      />
    </>
  );
};

export default SchedulesPage;
