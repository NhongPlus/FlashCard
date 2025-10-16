// src/pages/Learning/components/Sidebar.tsx

import { Paper, Stack, Text, Box, Badge } from '@mantine/core';
import type { LearningMode } from '@/@types/learning';

interface SidebarProps {
  mode: LearningMode;
  totalCards: number;
  masteredCount: number;
  basicProgress?: number;
  currentCardViewed?: boolean;
  currentCardMastered?: boolean;
}

export function Sidebar({
  mode,
  totalCards,
  masteredCount,
  basicProgress = 0,
  currentCardViewed = false,
  currentCardMastered = false
}: SidebarProps) {
  const unmasteredCount = totalCards - masteredCount;

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Text fw={600} size="lg">Tổng quan</Text>
        
        {mode === 'study' ? (
          <>
            <Box>
              <Text size="sm" mb={8}>Đã biết</Text>
              <Badge size="xl" variant="light" color="green" fullWidth>
                {masteredCount}
              </Badge>
            </Box>
            
            <Box>
              <Text size="sm" mb={8}>Đang học</Text>
              <Badge size="xl" variant="light" color="orange" fullWidth>
                {unmasteredCount}
              </Badge>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Text size="sm" mb={8}>Đã xem</Text>
              <Badge size="xl" variant="light" color="cyan" fullWidth>
                {basicProgress}
              </Badge>
            </Box>
            
            <Box>
              <Text size="sm" mb={8}>Chưa xem</Text>
              <Badge size="xl" variant="light" color="gray" fullWidth>
                {totalCards - basicProgress}
              </Badge>
            </Box>
          </>
        )}

        <Box mt="md" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: 8 }}>
          <Text size="sm" fw={500} mb="xs">Phím tắt:</Text>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Space - Lật thẻ</Text>
            {mode === 'study' ? (
              <>
                <Text size="xs" c="dimmed">← - Chưa thuộc</Text>
                <Text size="xs" c="dimmed">→ - Đã thuộc</Text>
              </>
            ) : (
              <>
                <Text size="xs" c="dimmed">← - Thẻ trước</Text>
                <Text size="xs" c="dimmed">→ - Thẻ tiếp theo</Text>
              </>
            )}
          </Stack>
        </Box>

        {mode === 'basic' && currentCardViewed && (
          <Badge color="cyan" variant="filled" size="lg" fullWidth>
            ✓ Thẻ này đã xem
          </Badge>
        )}
        
        {mode === 'study' && currentCardMastered && (
          <Badge color="green" variant="filled" size="lg" fullWidth>
            ✓ Thẻ này đã thuộc
          </Badge>
        )}
      </Stack>
    </Paper>
  );
}