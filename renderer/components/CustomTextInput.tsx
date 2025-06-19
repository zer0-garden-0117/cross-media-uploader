import { TextInput } from '@mantine/core';

interface CustomTextInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function CustomTextInput({ value, onChange }: CustomTextInputProps) {
  return (
    <TextInput
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder="Comment"
    />
  );
}