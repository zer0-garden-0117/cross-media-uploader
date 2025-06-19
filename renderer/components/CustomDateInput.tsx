import { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';

interface CustomDateInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function CustomDateInput({ value, onChange }: CustomDateInputProps) {
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
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