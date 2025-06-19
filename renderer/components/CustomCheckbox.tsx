import { Group, Checkbox } from '@mantine/core';

interface CustomCheckboxProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function CustomCheckbox({ options, value, onChange }: CustomCheckboxProps) {
  const handleCheckboxChange = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <Group>
      {options.map((option) => (
        <Checkbox
          size='xs'
          key={option}
          label={option}
          checked={value.includes(option)}
          onChange={() => handleCheckboxChange(option)}
        />
      ))}
    </Group>
  );
}