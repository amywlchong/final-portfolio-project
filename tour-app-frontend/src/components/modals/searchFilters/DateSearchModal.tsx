import { useState } from "react";
import { Range } from "react-date-range";
import { addDays, format } from "date-fns";
import useScreenSize from "../../../hooks/ui/useScreenSize";
import { useDateSearchModal } from "../../../hooks/modals/useModals";
import useTours from "../../../hooks/data/useTours";
import { createServiceHandler } from "../../../utils/serviceHandler";
import { ApiError } from "../../../utils/ApiError";
import toast from "react-hot-toast";
import Modal from "../Modal";
import DatePicker from "../../inputs/DatePicker";
import Heading from "../../ui/Heading";

const DateSearchModal = () => {
  const { is400AndUp, is500AndUp } = useScreenSize();
  const dateSearch = useDateSearchModal();
  const [isLoading, setIsLoading] = useState(false);

  const { filterTours } = useTours();
  const initialDateRange = {
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: "selection"
  };
  const [selectedDateRange, setSelectedDateRange] = useState<Range>(initialDateRange);

  const updateURL = (startDate: Date | undefined | null, endDate: Date | undefined | null) => {
    const updatedQuery = new URLSearchParams(window.location.search);

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

    const url = `/?${updatedQuery.toString()}`;
    window.history.pushState({}, "", url);
  };

  const filterToursHandler = createServiceHandler(filterTours, {
    startLoading: () => setIsLoading(true),
    endLoading: () => setIsLoading(false),
  }, { handle: (_error: ApiError) => { toast.error("An error occurred. Please try again.");}});

  const onSubmit = async () => {
    updateURL(selectedDateRange.startDate, selectedDateRange.endDate);

    const currentQuery = new URLSearchParams(window.location.search);
    await filterToursHandler(currentQuery.get("regions")?.split(",") || [], currentQuery.get("startDate"), currentQuery.get("endDate"));
    dateSearch.onClose();
  };

  const onClear = async () => {
    setSelectedDateRange(initialDateRange);
    updateURL(null, null);

    const currentQuery = new URLSearchParams(window.location.search);
    await filterToursHandler(currentQuery.get("regions")?.split(",") || [], null, null);
  };

  const bodyContent = (
    <div>
      <div style={{ marginLeft: is500AndUp ? "24px" : is400AndUp ? "20px" : 0 }}>
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
      disabled={isLoading}
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
