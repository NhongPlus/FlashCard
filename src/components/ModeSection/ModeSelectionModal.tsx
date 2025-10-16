// src/pages/Learning/components/ModeSelectionModal.tsx

import { Modal, Title, Stack, Paper, Group, Text, Button } from '@mantine/core';
import { IconBook, IconBrain } from '@tabler/icons-react';
import type { LearningMode } from '@/@types/learning';

interface ModeSelectionModalProps {
  opened: boolean;
  onSelect: (mode: LearningMode) => void;
}

export function ModeSelectionModal({ opened, onSelect }: ModeSelectionModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      centered
      size="lg"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title={'Chọn chế độ học tập'}
    >
      <Stack gap="lg" py="md">
        <Paper 
          p="xl" 
          withBorder 
          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => onSelect('basic')}
        >
          <Stack gap="md">
            <Group>
              <IconBook size={32} color="#4dabf7" />
              <Title order={3}>Basic Mode</Title>
            </Group>
            <Text c="dimmed">
              Xem thẻ tuần tự, có thể shuffle và quay lại. 
              Phù hợp để làm quen với nội dung.
            </Text>
            <Button fullWidth variant="light" color="blue">
              Chọn Basic Mode
            </Button>
          </Stack>
        </Paper>

        <Paper 
          p="xl" 
          withBorder 
          style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => onSelect('study')}
        >
          <Stack gap="md">
            <Group>
              <IconBrain size={32} color="#ff6b6b" />
              <Title order={3}>Study Mode</Title>
            </Group>
            <Text c="dimmed">
              Đánh giá từng thẻ, tự động shuffle. 
              Phù hợp để kiểm tra kiến thức đã học.
            </Text>
            <Button fullWidth variant="light" color="red">
              Chọn Study Mode
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Modal>
  );
}