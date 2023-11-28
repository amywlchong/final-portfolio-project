import { useState } from "react";
import { useAppSelector } from "../../../app/reduxHooks";
import { useLocationSearchModal } from "../../../hooks/modals/useModals";
import useTours from "../../../hooks/data/useTours";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";
import { Autocomplete, Checkbox, ListItemText, TextField } from "@mui/material";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Heading from "../../ui/Heading";

const LocationSearchModal = () => {
  const locationSearch = useLocationSearchModal();
  const [isLoading, setIsLoading] = useState(false);

  const { filterTours } = useTours();
  const allRegions = useAppSelector((state) => state.tours.allRegions);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const updateURL = (regions: string[]) => {
    const updatedQuery = new URLSearchParams(window.location.search);
    if (regions.length > 0) {
      updatedQuery.set("regions", regions.join(","));
    } else {
      updatedQuery.delete("regions");
    }
    const url = `/?${updatedQuery.toString()}`;
    window.history.pushState({}, "", url);
  };

  const filterToursHandler = createServiceHandler(
    filterTours,
    {
      startLoading: () => setIsLoading(true),
      endLoading: () => setIsLoading(false),
    },
    {
      handle: (_error: ApiError) => {
        toast.error("An error occurred. Please try again.");
      },
    }
  );

  const onSubmit = async () => {
    if (selectedRegions.length == 0) {
      onClear();
      return;
    }

    updateURL(selectedRegions);

    const currentQuery = new URLSearchParams(window.location.search);
    await filterToursHandler(
      selectedRegions,
      currentQuery.get("startDate"),
      currentQuery.get("endDate")
    );
    locationSearch.onClose();
  };

  const onClear = async () => {
    setSelectedRegions([]);
    updateURL([]);

    const currentQuery = new URLSearchParams(window.location.search);
    await filterToursHandler(
      [],
      currentQuery.get("startDate"),
      currentQuery.get("endDate")
    );
  };

  const bodyContent = (
    <div>
      <Heading
        title="Where do you wanna go?"
        subtitle="Find your dream location!"
      />
      <Autocomplete
        multiple
        id="locations-autocomplete"
        options={allRegions}
        value={selectedRegions}
        onChange={(_, newValue) => setSelectedRegions([...newValue])}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox checked={selected} />
            <ListItemText primary={option} />
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Locations" />
        )}
        sx={{ marginTop: "20px" }}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={locationSearch.isOpen}
      title="Filter"
      actionLabel={"Search"}
      onSubmit={onSubmit}
      secondaryActionLabel={"Clear"}
      secondaryAction={onClear}
      onClose={locationSearch.onClose}
      body={bodyContent}
    />
  );
};

export default LocationSearchModal;
