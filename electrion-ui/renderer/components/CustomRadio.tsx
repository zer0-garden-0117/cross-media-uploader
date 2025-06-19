import { Group, Radio } from '@mantine/core';

interface CustomRadioProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function CustomRadio({ options, value, onChange }: CustomRadioProps) {
  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      withAsterisk
    >
      <Group>
        {options.map((option) => (
          <Radio 
            size='xs'
            key={option} 
            label={option} 
            value={option} 
            checked={value === option}
          />
        ))}
      </Group>
    </Radio.Group>
  )
}