import { useState } from "react";
import { Range } from "react-date-range";
import { addDays, format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import useScreenSize from "../../../hooks/ui/useScreenSize";
import { useDateSearchModal } from "../../../hooks/modals/useModals";
import Modal from "../Modal";
import DatePicker from "../../inputs/DatePicker";
import Heading from "../../ui/Heading";

const DateSearchModal = () => {
  const { is400AndUp, is500AndUp } = useScreenSize();
  const dateSearch = useDateSearchModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: "selection",
  };
  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialDateRange);

  const updateURL = (
    startDate: Date | undefined | null,
    endDate: Date | undefined | null
  ) => {
    const updatedQuery = new URLSearchParams(searchParams);
    if (startDate) {
      updatedQuery.set("startDate", format(startDate, "yyyy-MM-dd"));
    } else {
      updatedQuery.delete("startDate");
    }
    if (endDate) {
      updatedQuery.set("endDate", format(endDate, "yyyy-MM-dd"));
    } else {
      updatedQuery.delete("endDate");
    }
    setSearchParams(updatedQuery);
  };

  const onSubmit = () => {
    updateURL(selectedDateRange.startDate, selectedDateRange.endDate);
    dateSearch.onClose();
  };

  const onClear = () => {
    setSelectedDateRange(initialDateRange);
    updateURL(null, null);
  };

  const bodyContent = (
    <div>
      <div
        style={{ marginLeft: is500AndUp ? "24px" : is400AndUp ? "20px" : 0 }}
      >
        <Heading
          title="When do you plan to go?"
          subtitle="Make sure everyone is free!"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <DatePicker
          onChange={(value) => setSelectedDateRange(value.selection)}
          value={selectedDateRange}
          minDate={addDays(new Date(), 1)}
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={dateSearch.isOpen}
      title="Filter"
      actionLabel={"Search"}
      onSubmit={onSubmit}
      secondaryActionLabel={"Clear"}
      secondaryAction={onClear}
      onClose={dateSearch.onClose}
      body={bodyContent}
    />
  );
};

export default DateSearchModal;
