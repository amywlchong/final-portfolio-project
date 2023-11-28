import { useAppSelector } from "../../app/reduxHooks";
import useTours from "../../hooks/data/useTours";
import { StyledGrid } from "../../styles";

import EmptyState from "./EmptyState";
import TourCard from "./TourCard";
import Search from "./Search";

const ToursPage = () => {

  const { loadingAllTours, allToursError, loadingAvailableTours, availableToursError } = useTours();
  const tours = useAppSelector(state => state.tours.filteredTours);

  const isLoading = loadingAllTours || loadingAvailableTours;
  const error = allToursError || availableToursError;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: An error occurred while fetching tours.</div>;
  }

  if (tours.length === 0) {
    return (
      <>
        <Search />
        <EmptyState />
      </>
    );
  }

  // Sort tours by ratingsAverage
  const sortedTours = [...tours].sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));

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
