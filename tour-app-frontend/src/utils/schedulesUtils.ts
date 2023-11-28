import { GroupedSchedule, Role, ScheduleResponse } from "../types";
import { roleToLabel } from "./dataProcessing";

export const groupSchedules = (
  schedules: ScheduleResponse[]
): GroupedSchedule[] => {
  const grouped: { [key: string]: ScheduleResponse[] } = {};

  // Group by tourId and startDateId
  schedules.forEach((schedule) => {
    const key = `${schedule.tourId}-${schedule.startDateId}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(schedule);
  });

  return Object.values(grouped).map((group) => ({
    ids: group
      .map((s) => s.id)
      .filter(Boolean)
      .join(", "),

    userIds: group
      .map((s) => s.userId)
      .filter(Boolean)
      .join(", "),
    userIdsAndNames: group
      .map((s) => {
        if (s.userName && s.userId) {
          return `${s.userName} (id: ${s.userId})`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", "),
    userRoles: Array.from(
      new Set(
        group
          .map((s) => s.userRole)
          .filter(Boolean)
          .map((role) => roleToLabel(role as Role))
      )
    ).join(", "),

    tourId: group[0].tourId,
    tourName: group[0].tourName,
    tourDuration: group[0].tourDuration,
    tourRegion: group[0].tourRegion,
    startDateId: group[0].startDateId,
    startDateTime: group[0].startDateTime,
  }));
};
