import { addDays } from "date-fns";
import {
  DateRange,
  Range,
  RangeKeyDict
} from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DatePickerProps {
  value: Range,
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
}

const DatePicker = ({
  value,
  onChange,
  disabledDates
}: DatePickerProps) => {
  return (
    <DateRange
      rangeColors={['#262626']}
      ranges={[value]}
      date={addDays(new Date(), 1)}
      onChange={onChange}
      direction="vertical"
      showDateDisplay={false}
      minDate={addDays(new Date(), 1)}
      disabledDates={disabledDates}
    />
   );
}

export default DatePicker;
