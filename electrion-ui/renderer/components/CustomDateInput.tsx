import { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';

export function CustomDateInput() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DateTimePicker
      placeholder="Pick date and time"
      valueFormat="YYYY-MM-DD hh:mm A"
      timePickerProps={{
        withDropdown: true,
        popoverProps: { withinPortal: false },
        format: '12h',
      }}
      size='xs'
    />
  );
}