import { useState } from "react";
import qs from 'query-string';

import Modal from "./Modal";
import Heading from '../Heading';
import MultiSelect from '../inputs/MultiSelect';
import { Checkbox, ListItemText, MenuItem } from '@mui/material';
import { useAppSelector } from '../../app/reduxHooks';
import useLocationSearchModal from "../../hooks/useLocationSearchModal";

import useTours from "../../hooks/useTours"

const LocationSearchModal = () => {

  const locationSearch = useLocationSearchModal();
  const params = qs.parse(window.location.search);

  const { filterTours } = useTours();
  const allRegions = useAppSelector(state => state.tours.allRegions);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const onSubmit = () => {
    if (selectedRegions.length == 0) {
      onClear();
      return;
    }

    const currentQuery = { ...params };

    const updatedQuery = {
      ...currentQuery,
      regions: selectedRegions,
    };

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    window.history.pushState({}, '', url);

    filterTours(selectedRegions, params.startDate, params.endDate);
    locationSearch.onClose();
  };

  const onClear = () => {
    setSelectedRegions([]);

    const currentQuery = { ...params };

    const updatedQuery = {
      ...currentQuery,
      regions: [],
    };

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    window.history.pushState({}, '', url);

    filterTours([], params.startDate, params.endDate);
    locationSearch.onClose();
  }

  const bodyContent = (
    <div>
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfect location!"
      />
      <MultiSelect
        label={'Locations'}
        selectedOptions={selectedRegions}
        setSelectedOptions={setSelectedRegions}
        menuItems={allRegions.map((region) => (
          <MenuItem key={region} value={region}>
            <Checkbox checked={selectedRegions.indexOf(region) > -1} />
            <ListItemText primary={region} />
          </MenuItem>
        ))}
      />
    </div>
  )

  return (
    <Modal
      isOpen={locationSearch.isOpen}
      title="Filters"
      actionLabel={"Search"}
      onSubmit={onSubmit}
      secondaryActionLabel={"Clear"}
      secondaryAction={onClear}
      onClose={locationSearch.onClose}
      body={bodyContent}
    />
  );
}

export default LocationSearchModal;
