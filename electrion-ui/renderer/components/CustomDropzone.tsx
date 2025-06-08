import { useState } from 'react';
import { Group, Text, Image, Box, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';

export function CustomDropzone(props: Partial<DropzoneProps>) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleDrop = (files: File[]) => {
    console.log('accepted files', files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemove = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        {...props}
      >
        <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      {previews.length > 0 && (
        <Box mt="md">
          <Text size="sm" mb="xs">Preview:</Text>
          <Group>
            {previews.map((preview, index) => (
              <Box key={index} pos="relative">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  width={rem(100)}
                  height={rem(100)}
                  fit="cover"
                  radius="sm"
                />
                <Box
                  pos="absolute"
                  top={0}
                  right={0}
                  bg="red"
                  color="white"
                  style={{ cursor: 'pointer', borderRadius: '50%', width: rem(20), height: rem(20), display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => handleRemove(index)}
                >
                  ×
                </Box>
              </Box>
            ))}
          </Group>
        </Box>
      )}
    </div>
  );
}