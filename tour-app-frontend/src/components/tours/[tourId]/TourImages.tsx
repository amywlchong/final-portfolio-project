import { useAppSelector } from "../../../app/reduxHooks";
import ImageCarousel from "../../ui/ImageCarousel";

const TourImages = () => {
  const tour = useAppSelector(state => state.tours.currentTour);

  return (
    (tour?.tourImages && tour.tourImages.length > 0)
      ? (
        <ImageCarousel
          images={tour.tourImages}
          title={tour.name}
        />
      )
      : (<></>)
  );
};

export default TourImages;
