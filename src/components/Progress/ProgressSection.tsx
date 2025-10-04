// src/pages/Learning/components/ProgressSection.tsx

import { Box, Group, Text, Progress } from '@mantine/core';
import { type LearningMode } from '@/@types/learning';

interface ProgressSectionProps {
  mode: LearningMode;
  current: number;
  total: number;
  percentage: number;
}

export function ProgressSection({ mode, current, total, percentage }: ProgressSectionProps) {
  return (
    <Box>
      <Group justify="space-between" mb={4}>
        <Text size="sm" c="dimmed">
          {mode === 'study' ? 'Tiến trình đánh giá' : 'Tiến trình xem thẻ'}
        </Text>
        <Text size="sm" fw={500}>{current}/{total}</Text>
      </Group>
      <Progress
        value={percentage}
        size="lg"
        striped
        animated={current < total}
        color={mode === 'study' ? 'blue' : 'cyan'}
      />
      {current > 0 && current < total && (
        <Text size="sm" ta="center" c="dimmed" mt="xs">
          Còn {total - current} thẻ nữa để hoàn thành
        </Text>
      )}
    </Box>
  );
}