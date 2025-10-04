// src/pages/Learning/components/ModeSelectionModal.tsx

import { Modal, Title, Flex, Paper, Stack, Text, Button } from '@mantine/core';
import { IconBook, IconBrain } from '@tabler/icons-react';
import { type LearningMode } from '@/@types/learning';
import style from './ModeSelectionModal.module.css';

interface ModeSelectionModalProps {
  opened: boolean;
  onSelect: (mode: LearningMode) => void;
}

export function ModeSelectionModal({ opened, onSelect }: ModeSelectionModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => {}} // Không cho phép đóng
      centered
      size="xl"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{ backgroundOpacity: 0.85, blur: 3 }}
      classNames={{ header: style.header }}
      title="Chọn chế độ học"
    >
      <Flex direction={{ base: 'column', sm: 'row' }} gap="lg" py="md">
        <Paper
          p="xl"
          withBorder
          style={{ flex: 1, cursor: 'pointer' }}
          onClick={() => onSelect('basic')}
        >
          <Stack gap="md" align="center" ta="center">
            <IconBook size={40} color="#4dabf7" />
            <Title order={3}>Chế độ Cơ bản</Title>
            <Text c="dimmed" size="sm">
              Xem lại các thẻ theo thứ tự tuần tự. Phù hợp để ghi nhớ và làm quen với nội dung bộ thẻ.
            </Text>
            <Button fullWidth variant="light" mt="md">Chọn chế độ cơ bản</Button>
          </Stack>
        </Paper>

        <Paper
          p="xl"
          withBorder
          style={{ flex: 1, cursor: 'pointer' }}
          onClick={() => onSelect('study')}
        >
          <Stack gap="md" align="center" ta="center">
            <IconBrain size={40} color="#ff6b6b" />
            <Title order={3}>Chế độ Học tập</Title>
            <Text c="dimmed" size="sm">
              Tự đánh giá mức độ ghi nhớ của bạn với từng thẻ. Phù hợp để kiểm tra và củng cố kiến thức.
            </Text>
            <Button fullWidth variant="light" color="red" mt="md">Chọn chế độ học tập</Button>
          </Stack>
        </Paper>
      </Flex>
    </Modal>
  );
}