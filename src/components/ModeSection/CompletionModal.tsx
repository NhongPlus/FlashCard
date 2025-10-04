// src/pages/Learning/components/CompletionModal.tsx

import { Modal, Title, Stack, Text, Group, Badge, Button } from '@mantine/core';
import { IconRefresh, IconTargetArrow } from '@tabler/icons-react';
import { type LearningMode } from '@/@types/learning';

interface CompletionModalProps {
  opened: boolean;
  onClose: () => void;
  mode: LearningMode;
  totalCards: number;
  masteredCount: number;
  onReset: () => void;
  onContinue: () => void;
  onBackHome: () => void;
}

export function CompletionModal({
  opened,
  onClose,
  mode,
  totalCards,
  masteredCount,
  onReset,
  onContinue,
  onBackHome
}: CompletionModalProps) {
  const unmasteredCount = totalCards - masteredCount;
  const percentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="md"
      title="🎉 Hoàn thành!"
    >
      <Stack align="center" gap="lg" py="xl">
        {mode === 'study' ? (
          <>
            <Text size="xl" fw={700} c="blue">{percentage}% thông thạo</Text>
            <Stack gap="xs" w="100%">
              <Group justify="space-between">
                <Text size="sm">Đã thuộc</Text>
                <Badge color="green" variant="light">{masteredCount}</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Cần học lại</Text>
                <Badge color="orange" variant="light">{unmasteredCount}</Badge>
              </Group>
            </Stack>
            <Stack gap="md" w="100%" mt="md">
              <Button fullWidth leftSection={<IconRefresh size={20} />} onClick={onReset}>
                Học lại toàn bộ
              </Button>
              {unmasteredCount > 0 && (
                <Button fullWidth variant="light" leftSection={<IconTargetArrow size={20} />} onClick={onContinue}>
                  Học lại {unmasteredCount} thẻ chưa thuộc
                </Button>
              )}
            </Stack>
          </>
        ) : (
          <>
            <Text size="lg" fw={600} ta="center">Bạn đã xem hết {totalCards} thẻ.</Text>
            <Text size="sm" c="dimmed" ta="center">
              Hãy thử "Chế độ học tập" để kiểm tra kiến thức của mình!
            </Text>
            <Button onClick={onReset} size="md">Học lại từ đầu</Button>
          </>
        )}
        <Button variant="outline" onClick={onBackHome} fullWidth>
          Quay về trang chi tiết
        </Button>
      </Stack>
    </Modal>
  );
}