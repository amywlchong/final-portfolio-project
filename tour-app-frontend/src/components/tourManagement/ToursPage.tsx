import { useState } from "react";
import { useAppSelector } from "../../app/reduxHooks";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { Box, Typography } from "@mui/material";
import { Tour } from "../../types";
import Button from "../ui/Button";
import ToursTable from "./ToursTable";
import TourForm from "./tourForm/index";

const ToursPage = () => {
  const { isSmallAndUp } = useScreenSize();
  const currentUser = useAppSelector(state => state.user.loggedInUser);
  const [showTourForm, setShowTourForm] = useState<boolean>(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  if (!currentUser) {
    return <div>Please log in or sign up to continue.</div>;
  }

  return (
    <div>
      <Box style={{ display: "flex", flexDirection: `${isSmallAndUp ? "row" : "column"}`, justifyContent: "space-between", alignItems: `${isSmallAndUp ? "center" : "flex-start"}` }}>
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
        <Box mt={2}>
          <ToursTable
            setEditingTour={setEditingTour}
            setShowTourForm={setShowTourForm}
          />
        </Box>
      }

      {showTourForm && <Box mt={2}><TourForm tour={editingTour} /></Box>}
    </div>
  );
};

export default ToursPage;
