import { useAppSelector } from "../../../app/reduxHooks";
import { Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";

const PointsOfInterest = () => {
  const tour = useAppSelector((state) => state.tours.currentTour);

  return tour?.tourPointsOfInterest && tour.tourPointsOfInterest.length > 0 ? (
    <>
      <Typography variant="h2">Points of Interest:</Typography>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          marginTop: 0,
        }}
      >
        {tour.tourPointsOfInterest?.map((poi) => (
          <TimelineItem key={poi.id}>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h3" component="span">
                {poi.pointOfInterest.name}
              </Typography>
              <Typography>{poi.pointOfInterest.description}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  ) : (
    <></>
  );
};

export default PointsOfInterest;
