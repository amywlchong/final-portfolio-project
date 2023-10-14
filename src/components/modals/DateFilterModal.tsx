import { Range } from 'react-date-range';

import Modal from "./Modal";
import DatePicker from "../inputs/DatePicker";
import { sub } from 'date-fns';
import useDateFilterModal from '../../hooks/useDateFilterModal';

interface DateFilterModalProps {
  filterDateRange: Range;
  setFilterDateRange: React.Dispatch<React.SetStateAction<Range>>;
}

const DateFilterModal = ({ filterDateRange, setFilterDateRange }: DateFilterModalProps) => {

  const dateFilterModal = useDateFilterModal();

  const bodyContent = (
    <div>
      <DatePicker
        onChange={(value) => setFilterDateRange(value.selection)}
        value={filterDateRange}
        minDate={sub(new Date(), { days: 365 })}
      />
    </div>
  )

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
}

export default DateFilterModal;
