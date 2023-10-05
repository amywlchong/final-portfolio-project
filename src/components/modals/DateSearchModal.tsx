import qs from 'query-string';
import { useState } from "react";
import { Range } from 'react-date-range';
import { addDays, format } from 'date-fns';

import Modal from "./Modal";
import DatePicker from "../inputs/DatePicker";
import Heading from '../Heading';
import useDateSearchModal from '../../hooks/useDateSearchModal';
import useTours from '../../hooks/useTours';

const DateSearchModal = () => {

  const dateSearch = useDateSearchModal();
  const params = qs.parse(window.location.search);

  const { filterTours } = useTours();
  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: 'selection'
  };
  const [selectedDateRange, setSelectedDateRange] = useState<Range>(initialDateRange);

  const onSubmit = () => {
    const currentQuery = { ...params };
    const updatedQuery = { ...currentQuery };

    if (selectedDateRange.startDate) {
      updatedQuery.startDate = format(selectedDateRange.startDate, 'yyyy-MM-dd');
    }

    if (selectedDateRange.endDate) {
      updatedQuery.endDate = format(selectedDateRange.endDate, 'yyyy-MM-dd');
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    window.history.pushState({}, '', url);

    filterTours(params.regions, updatedQuery.startDate, updatedQuery.endDate);
    dateSearch.onClose();
  };

  const onClear = () => {
    setSelectedDateRange(initialDateRange);

    const currentQuery = { ...params };

    const updatedQuery = {
      ...currentQuery,
      startDate: null,
      endDate: null,
    };

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    window.history.pushState({}, '', url);

    filterTours(params.regions, null, null);
    dateSearch.onClose();
  }

  const bodyContent = (
    <div>
      <Heading
        title="When do you plan to go?"
        subtitle="Make sure everyone is free!"
      />
      <DatePicker
        onChange={(value) => setSelectedDateRange(value.selection)}
        value={selectedDateRange}
      />
    </div>
  )

  return (
    <Modal
      isOpen={dateSearch.isOpen}
      title="Filters"
      actionLabel={"Search"}
      onSubmit={onSubmit}
      secondaryActionLabel={"Clear"}
      secondaryAction={onClear}
      onClose={dateSearch.onClose}
      body={bodyContent}
    />
  );
}

export default DateSearchModal;
