import { Range } from "react-date-range";
import { sub } from "date-fns";
import { useDateFilterModal } from "../../../hooks/modals/useModals";
import Modal from "../Modal";
import DatePicker from "../../inputs/DatePicker";

interface DateFilterModalProps {
  filterDateRange: Range;
  setFilterDateRange: (newRange: Range) => void;
}

const DateFilterModal = ({ filterDateRange, setFilterDateRange }: DateFilterModalProps) => {

  const dateFilterModal = useDateFilterModal();

  const bodyContent = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <DatePicker
        onChange={(value) => setFilterDateRange(value.selection)}
        value={filterDateRange}
        minDate={sub(new Date(), { days: 365 })}
      />
    </div>
  );

  return (
    <Modal
      isOpen={dateFilterModal.isOpen}
      title="Filter by Start Date"
      actionLabel={"Filter"}
      onSubmit={dateFilterModal.onClose}
      onClose={dateFilterModal.onClose}
      body={bodyContent}
    />
  );
};

export default DateFilterModal;
