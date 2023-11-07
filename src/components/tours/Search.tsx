import qs from "query-string";
import { useMemo } from "react";

import { BiSearch } from "react-icons/bi";
import useLocationSearchModal from "../../hooks/useLocationSearchModal";
import useDateSearchModal from "../../hooks/useDateSearchModal";
import Button from "../Button";
import { Box } from "@mui/material";

const Search = () => {

  const locationSearch = useLocationSearchModal();
  const dateSearch = useDateSearchModal();
  const params = qs.parse(window.location.search);

  const regions = params.regions;
  const startDate = params.startDate;
  const endDate = params.endDate;

  const locationLabel = useMemo(() => {
    const trimString = (str: string) => {
      const maxLength = 20;
      if (str.length > maxLength) {
        return str.substring(0, maxLength - 3) + "...";
      }
      return str;
    };

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
