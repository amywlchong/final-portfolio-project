import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../app/reduxHooks";
import { useLocationSearchModal } from "../../../hooks/modals/useModals";
import { Autocomplete, Checkbox, ListItemText, TextField } from "@mui/material";
import Modal from "../Modal";
import Heading from "../../ui/Heading";

const LocationSearchModal = () => {
  const locationSearch = useLocationSearchModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const allRegions = useAppSelector((state) => state.tours.allRegions);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const updateURL = (regions: string[]) => {
    const updatedQuery = new URLSearchParams(searchParams);
    if (regions.length > 0) {
      updatedQuery.set("regions", regions.join(","));
    } else {
      updatedQuery.delete("regions");
    }
    setSearchParams(updatedQuery);
  };

  const onSubmit = () => {
    if (selectedRegions.length === 0) {
      onClear();
      return;
    }
    updateURL(selectedRegions);
    locationSearch.onClose();
  };

  const onClear = () => {
    setSelectedRegions([]);
    updateURL([]);
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
