import { useMemo } from "react";
import { useLocationSearchModal } from "../../hooks/modals/useModals";
import { useDateSearchModal } from "../../hooks/modals/useModals";
import { Box } from "@mui/material";
import { BiSearch } from "react-icons/bi";
import Button from "../ui/Button";

const Search = () => {

  const locationSearch = useLocationSearchModal();
  const dateSearch = useDateSearchModal();
  const params = new URLSearchParams(window.location.search);

  const regions = params.get("regions");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  const MAX_LABEL_LENGTH = 20;

  const trimString = (str: string) => {
    if (str.length > MAX_LABEL_LENGTH) {
      return str.substring(0, MAX_LABEL_LENGTH - 3) + "...";
    }
    return str;
  };

  const locationLabel = useMemo(() => {
    if (Array.isArray(regions) && regions.length > 0) {
      return trimString(regions.join(", "));
    } else if (typeof regions === "string") {
      return trimString(regions);
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
    <Box display="flex" flexDirection="row" justifyContent="center" margin={"10px auto"}>
      <Button label={locationLabel} onClick={locationSearch.onOpen} outline={true} icon={BiSearch} sx={{ width: "230px" }} />
      <Button label={durationLabel} onClick={dateSearch.onOpen} outline={true} icon={BiSearch} sx={{ width: "230px" }} />
    </Box>
  );
};

export default Search;
