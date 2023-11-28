import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { useDeleteTourModal } from "../../hooks/modals/useModals";
import { Link } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Difficulty, Tour } from "../../types";
import { formatDateAndTime } from "../../utils/dataProcessing";
import { setAllTours } from "../../redux/slices/tourSlice";
import DeleteTourModal from "../modals/tours/DeleteTourModal";

interface ToursTableProps {
  setEditingTour: React.Dispatch<React.SetStateAction<Tour | null>>;
  setShowTourForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToursTable = ({ setEditingTour, setShowTourForm }: ToursTableProps) => {

  const dispatch = useAppDispatch();
  const tours = useAppSelector(state => state.tours.allTours);

  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const deleteTourModal = useDeleteTourModal();

  const columns = useMemo<MRT_ColumnDef<Tour>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        size: 100
      },
      {
        header: "Tour Name",
        accessorKey: "name",
        size: 200,
        Cell: ({ row }: { row: { original: Tour } }) => (
          <Link to={`/tours/${row.original.id}`}>
            {row.original.name}
          </Link>
        ),
      },
      {
        header: "Duration (days)",
        accessorKey: "duration",
        size: 100,
        filterVariant: "range"
      },
      {
        header: "Max Group Size",
        accessorKey: "maxGroupSize",
        size: 100,
        filterVariant: "range"
      },
      {
        header: "Difficulty",
        accessorKey: "difficulty",
        size: 120,
        filterVariant: "multi-select",
        filterSelectOptions: Object.values(Difficulty),
        Cell: ({ row }: { row: { original: Tour } }) => (
          <Box
            component="span"
            sx={() => ({
              backgroundColor:
                row.original.difficulty === "difficult"
                  ? "rgba(239, 154, 154, 0.4)"
                  : row.original.difficulty === "medium"
                    ? "rgba(255, 224, 130, 0.4)"
                    : "rgba(165, 214, 167, 0.4)",
              color:
                row.original.difficulty === "difficult"
                  ? "#b71c1c"
                  : row.original.difficulty === "medium"
                    ? "#ff6f00"
                    : "#1b5e20",
              borderRadius: "0.8rem",
              mx: "auto",
              textTransform: "uppercase",
              p: "0.5rem",
            })}
          >
            {row.original.difficulty}
          </Box>
        ),
      },
      {
        header: "Price ($)",
        accessorKey: "price",
        size: 140,
        filterVariant: "range"
      },
      {
        header: "Summary",
        accessorKey: "summary",
        size: 200
      },
      {
        header: "Location",
        accessorKey: "region",
        size: 150
      },
      {
        header: "Start Address",
        accessorKey: "startAddress",
        size: 200
      },
      {
        header: "Ratings Count",
        accessorKey: "ratingsCount",
        size: 140,
        filterVariant: "range"
      },
      {
        accessorFn: (originalRow) => originalRow.ratingsAverage ? originalRow.ratingsAverage : "N/A",
        id: "ratingsAverage",
        header: "Ratings Average",
        size: 100,
        filterVariant: "range",
      }
    ],
    []
  );

  const handleDeleteClick = (tour: Tour): void => {
    setTourToDelete(tour);
    deleteTourModal.onOpen();
  };

  const handleSuccessfulDelete = (tourDeleted: Tour): void => {
    dispatch(setAllTours(tours.filter(tour => tour.id !== tourDeleted.id)));
  };

  const handleCloseDeleteModal = (): void => {
    setTourToDelete(null);
  };

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={tours}
        renderDetailPanel={({ row }: { row: { original: Tour } }) => (
          <Box>
            <Box>
              <Typography variant="body1" fontWeight="bold">Points of Interest:</Typography>
              <Typography variant="body1">
                {row.original.tourPointsOfInterest && row.original.tourPointsOfInterest.length > 0
                  ? row.original.tourPointsOfInterest.map(poi => poi.pointOfInterest.name).join(", ")
                  : "No points of interest"}
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="body1" fontWeight="bold">Start Dates:</Typography>
              <Typography variant="body1">
                {row.original.tourStartDates && row.original.tourStartDates.length > 0
                  ? (
                    [...row.original.tourStartDates]
                      .sort((a, b) => new Date(a.startDate.startDateTime).getTime() - new Date(b.startDate.startDateTime).getTime())
                      .slice(0, 2)
                      .map(date => formatDateAndTime(date.startDate.startDateTime))
                      .join(", ") +
                    (row.original.tourStartDates.length > 2 ? ", and more" : "")
                  )
                  : "No start dates"}
              </Typography>
            </Box>
          </Box>
        )}
        enableRowActions
        enablePinning
        initialState={{ columnPinning: { right: ["mrt-row-actions"] } }}
        positionActionsColumn="last"
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            }
          }
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              onClick={() => {
                setEditingTour(row.original);
                setShowTourForm(true);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(row.original)} color="warning">
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        )}
      />

      {tourToDelete &&
        <DeleteTourModal
          tourToDelete={tourToDelete}
          handleSuccessfulDelete={handleSuccessfulDelete}
          onClose={handleCloseDeleteModal}
        />
      }
    </>
  );
};

export default ToursTable;
