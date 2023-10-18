import { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { type MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom";
import Button from "../Button";
import TourForm from "./TourForm";
import { useAppDispatch, useAppSelector } from "../../app/reduxHooks";
import { Difficulty, Tour } from "../../types";
import { dateToDateString, formatDateAndTime } from "../../utils/dataProcessing";
import useDeleteTourModal from "../../hooks/useDeleteTourModal";
import { setAllTours } from "../../redux/slices/tourSlice";
import DeleteTourModal from "../modals/DeleteTourModal";
import toast from "react-hot-toast";

const ToursPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const tours = useAppSelector(state => state.tours.allTours);
  const [showTourForm, setShowTourForm] = useState<boolean>(false);

  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const deleteTourModal = useDeleteTourModal();

  useEffect(() => {
    if (!currentUser) {
      toast("Please log in or sign up to continue", { icon: '❗' });
      return;
    }
  }, [currentUser]);

  const columns = useMemo<MRT_ColumnDef<Tour>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        size: 100
      },
      {
        header: 'Tour Name',
        accessorKey: 'name',
        size: 200,
        Cell: ({ row }: { row: { original: Tour } }) => (
          <Link to={`/tours/${row.original.id}`}>
            {row.original.name}
          </Link>
        ),
      },
      {
        header: 'Duration (days)',
        accessorKey: 'duration',
        size: 100,
        filterVariant: 'range'
      },
      {
        header: 'Max Group Size',
        accessorKey: 'maxGroupSize',
        size: 100,
        filterVariant: 'range'
      },
      {
        header: 'Difficulty',
        accessorKey: 'difficulty',
        size: 120,
        filterVariant: 'multi-select',
        filterSelectOptions: Object.values(Difficulty)
      },
      {
        header: 'Price ($)',
        accessorKey: 'price',
        size: 140,
        filterVariant: 'range'
      },
      {
        header: 'Summary',
        accessorKey: 'summary',
        size: 200
      },
      {
        header: 'Region',
        accessorKey: 'region',
        size: 150
      },
      {
        header: 'Start Address',
        accessorKey: 'startAddress',
        size: 200
      },
      {
        header: 'Ratings Count',
        accessorKey: 'ratingsCount',
        size: 140,
        filterVariant: 'range'
      },
      {
        header: 'Ratings Average',
        accessorKey: 'ratingsAverage',
        size: 100,
        filterVariant: 'range'
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.createdDate), //convert to date for sorting and filtering
        id: 'createdDate',
        header: 'Created Date',
        size: 100,
        filterVariant: 'date-range',  // filtering by 'date-range' is a beta feature
        Cell: ({ cell }) => dateToDateString(cell.getValue<Date>()), // convert back to string for display
      },
    ],
    []
  );

  const handleDeleteClick = (tour: Tour) => {
    setTourToDelete(tour);
    deleteTourModal.onOpen();
  };

  const handleSuccessfulDelete = (tourDeleted: Tour) => {
    dispatch(setAllTours(tours.filter(tour => tour.id !== tourDeleted.id)));
  }

  const handleCloseDeleteModal = () => {
    setTourToDelete(null);
  };

  return (
    <div>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1">Tours</Typography>
        <Button
          label={showTourForm ? "All Tours" : "New Tour"}
          onClick={
            () => {
              setEditingTour(null);
              setShowTourForm(prev => !prev);
            }
          }
          sx={{ marginRight: 2 }}
        />
      </Box>
      {!showTourForm &&
        <MaterialReactTable
          columns={columns}
          data={tours}
          renderDetailPanel={({ row }) => (
            <Box>
              <Box>
                <Typography variant="body1" fontWeight="bold">Points of Interest:</Typography>
                <Typography variant="body1">
                  {row.original.tourPointsOfInterest && row.original.tourPointsOfInterest.length > 0
                    ? row.original.tourPointsOfInterest.map(poi => poi.pointOfInterest.name).join(', ')
                    : 'No points of interest'}
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
                        .join(', ') +
                      (row.original.tourStartDates.length > 2 ? ', and more' : '')
                    )
                    : 'No start dates'}
                </Typography>
              </Box>
            </Box>
          )}
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
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
      }

      {showTourForm && <TourForm tour={editingTour} />}

      {tourToDelete &&
        <DeleteTourModal
          tourToDelete={tourToDelete}
          handleSuccessfulDelete={handleSuccessfulDelete}
          onClose={handleCloseDeleteModal}
        />
      }
    </div>
  );
};

export default ToursPage;
