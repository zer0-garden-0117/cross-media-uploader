import { PillsInput, Pill, TagsInput } from '@mantine/core';

interface CustomTagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CustomTagsInput({ value, onChange }: CustomTagsInputProps) {
  return (
    <TagsInput
      value={value}
      onChange={onChange} 
      placeholder="Tags"
    />
  )
}