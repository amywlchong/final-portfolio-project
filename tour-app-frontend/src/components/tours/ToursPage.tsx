import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useTours from "../../hooks/data/useTours";
import { StyledGrid } from "../../styles";

import EmptyState from "./EmptyState";
import TourCard from "./TourCard";
import Search from "./Search";

const ToursPage = () => {
  const {
    loadingAllTours,
    allToursError,
    loadingAvailableTours,
    availableToursError,
    filterTours,
    filteredTours,
  } = useTours();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const regions = params.get("regions")?.split(",") || [];
  const startDate = params.get("startDate") || null;
  const endDate = params.get("endDate") || null;

  useEffect(() => {
    filterTours(regions, startDate, endDate);
  }, [loadingAllTours, location.search]);

  const isLoading = loadingAllTours || loadingAvailableTours;
  const error = allToursError || availableToursError;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: An error occurred while fetching tours.</div>;
  }

  if (filteredTours.length === 0) {
    return (
      <>
        <Search />
        <EmptyState />
      </>
    );
  }

  // Sort tours by ratingsAverage
  const sortedTours = [...filteredTours].sort(
    (a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0)
  );

  return (
    <>
      <Search />
      <StyledGrid>
        {sortedTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </StyledGrid>
    </>
  );
};

export default ToursPage;
