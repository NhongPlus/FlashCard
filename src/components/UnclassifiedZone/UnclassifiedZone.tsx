// src/pages/Folder/components/UnclassifiedZone.tsx

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Paper, Stack, Group, Text, Badge, Box } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import { DraggableStudySet } from '../Draggable/DraggableStudySet';
import type { StudySetInFolder } from '@/@types/folder';

interface UnclassifiedZoneProps {
  studySets: StudySetInFolder[];
  isOver?: boolean;
  onEditStudySet?: (studySet: StudySetInFolder) => void;
  onDeleteStudySet?: (studySet: StudySetInFolder) => void;
}

export function UnclassifiedZone({
  studySets,
  isOver: isOverProp,
  onEditStudySet,
  onDeleteStudySet,
}: UnclassifiedZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unclassified',
    data: {
      type: 'unclassified',
    },
  });

  const showOver = isOver || isOverProp;
  const isEmpty = studySets.length === 0;

  return (
    <Paper
      ref={setNodeRef}
      p="md"
      withBorder
      radius="md"
      style={{
        backgroundColor: showOver ? '#fff3e0' : 'white',
        border: showOver ? '2px dashed #ff9800' : undefined,
        transition: 'all 0.2s ease',
        minHeight: 300,
      }}
    >
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconInbox size={20} color="#ff9800" />
          <Text fw={600} size="sm">
            Chưa phân loại
          </Text>
          <Badge variant="light" color="orange" size="sm">
            {studySets.length}
          </Badge>
        </Group>
      </Group>

      <Text size="xs" c="dimmed" mb="md">
        Các bộ thẻ chưa được thêm vào thư mục nào
      </Text>

      {/* Study Sets List */}
      <SortableContext
        items={studySets.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack gap="xs">
          {studySets.map(studySet => (
            <DraggableStudySet
              key={studySet.id}
              studySet={studySet}
              onEdit={onEditStudySet}
              onDelete={onDeleteStudySet}
            />
          ))}

          {/* Empty State */}
          {isEmpty && !showOver && (
            <Box
              p="xl"
              style={{
                border: '2px dashed #dee2e6',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <Text size="sm" c="dimmed">
                🎉 Tất cả bộ thẻ đã được phân loại!
              </Text>
            </Box>
          )}

          {/* Drop Indicator */}
          {showOver && (
            <Box
              p="xl"
              style={{
                border: '2px dashed #ff9800',
                borderRadius: 8,
                textAlign: 'center',
                backgroundColor: '#fff3e0',
              }}
            >
              <Text size="sm" c="orange" fw={500}>
                Thả vào đây để bỏ khỏi thư mục
              </Text>
            </Box>
          )}
        </Stack>
      </SortableContext>
    </Paper>
  );
}