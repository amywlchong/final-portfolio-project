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
  minDate?: Date;
}

const DatePicker = ({
  value,
  onChange,
  disabledDates,
  minDate
}: DatePickerProps) => {
  return (
    <DateRange
      rangeColors={['#262626']}
      ranges={[value]}
      date={new Date()}
      shownDate={new Date()}
      onChange={onChange}
      direction="vertical"
      showDateDisplay={false}
      minDate={minDate || new Date()}
      disabledDates={disabledDates}
    />
   );
}

export default DatePicker;
