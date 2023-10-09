import qs from 'query-string';
import { useState } from "react";
import { Range } from 'react-date-range';
import { addDays, format } from 'date-fns';

import Modal from "./Modal";
import DatePicker from "../inputs/DatePicker";
import Heading from '../Heading';
import useDateSearchModal from '../../hooks/useDateSearchModal';
import useTours from '../../hooks/useTours';
import { createServiceHandler } from '../../utils/serviceHandler';
import toast from 'react-hot-toast';
import { ApiError } from '../../utils/ApiError';

const DateSearchModal = () => {

  const dateSearch = useDateSearchModal();
  const [isLoading, setIsLoading] = useState(false);
  const params = qs.parse(window.location.search);

  const { filterTours } = useTours();
  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: 'selection'
  };
  const [selectedDateRange, setSelectedDateRange] = useState<Range>(initialDateRange);

  const filterToursHandler = createServiceHandler(filterTours, {
    startLoading: () => setIsLoading(true),
    endLoading: () => setIsLoading(false),
  }, { handle: (_error: ApiError) => { toast.error("An error occurred. Please try again.")}});

  const onSubmit = async () => {
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

    await filterToursHandler(params.regions, updatedQuery.startDate, updatedQuery.endDate);

    dateSearch.onClose();
  };

  const onClear = async () => {
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

    await filterToursHandler(params.regions, null, null);
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
      disabled={isLoading}
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
