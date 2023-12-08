import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocationSearchModal } from "../../hooks/modals/useModals";
import { useDateSearchModal } from "../../hooks/modals/useModals";
import { Box } from "@mui/material";
import { BiSearch } from "react-icons/bi";
import Button from "../ui/Button";

const Search = () => {
  const locationSearch = useLocationSearchModal();
  const dateSearch = useDateSearchModal();
  const [searchParams] = useSearchParams();

  const regions = searchParams.get("regions")?.split(",") || [];
  const startDate = searchParams.get("startDate") || null;
  const endDate = searchParams.get("endDate") || null;

  const MAX_LABEL_LENGTH = 20;

  const trimString = (str: string) => {
    if (str.length > MAX_LABEL_LENGTH) {
      return str.substring(0, MAX_LABEL_LENGTH - 3) + "...";
    }
    return str;
  };

  const locationLabel = useMemo(() => {
    if (regions.length > 1) {
      return trimString(regions.join(", "));
    } else if (regions.length === 1) {
      return trimString(regions[0]);
    }
    return "Anywhere";
  }, [regions]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`;
    }
    return "Any Week";
  }, [startDate, endDate]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      margin={"10px auto"}
    >
      <Button
        label={locationLabel}
        onClick={locationSearch.onOpen}
        outline={true}
        icon={BiSearch}
        sx={{ width: "230px" }}
      />
      <Button
        label={durationLabel}
        onClick={dateSearch.onOpen}
        outline={true}
        icon={BiSearch}
        sx={{ width: "230px" }}
      />
    </Box>
  );
};

export default Search;
