// src/pages/Folder/components/DroppableFolder.tsx

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Paper, Stack, Group, Text, Badge, ActionIcon, Box } from '@mantine/core';
import { IconFolder, IconDotsVertical, IconFolderOpen } from '@tabler/icons-react';
import { DraggableStudySet } from '../Draggable/DraggableStudySet';
import type { Folder, StudySetInFolder } from '@/@types/folder';

interface DroppableFolderProps {
  folder: Folder;
  studySets: StudySetInFolder[];
  isOver?: boolean;
  onEditFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folder: Folder) => void;
  onEditStudySet?: (studySet: StudySetInFolder) => void;
  onDeleteStudySet?: (studySet: StudySetInFolder) => void;
}

export function DroppableFolder({
  folder,
  studySets,
  isOver: isOverProp,
  onEditFolder,
  onEditStudySet,
  onDeleteStudySet,
}: DroppableFolderProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
    data: {
      type: 'folder',
      folder,
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
        backgroundColor: showOver ? '#e3f2fd' : 'white',
        border: showOver ? '2px dashed #2196f3' : undefined,
        transition: 'all 0.2s ease',
        minHeight: 120,
      }}
    >
      {/* Folder Header */}
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          {showOver ? (
            <IconFolderOpen size={20} color={folder.color || '#4dabf7'} />
          ) : (
            <IconFolder size={20} color={folder.color || '#4dabf7'} />
          )}
          <Text fw={600} size="sm">
            {folder.name}
          </Text>
          <Badge variant="light" color={folder.color || 'blue'} size="sm">
            {folder.studySetCount}
          </Badge>
        </Group>

        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={() => onEditFolder?.(folder)}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>

      {/* Folder Description */}
      {folder.description && (
        <Text size="xs" c="dimmed" mb="sm">
          {folder.description}
        </Text>
      )}

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
                Kéo thả bộ thẻ vào đây
              </Text>
            </Box>
          )}

          {/* Drop Indicator */}
          {showOver && (
            <Box
              p="xl"
              style={{
                border: '2px dashed #2196f3',
                borderRadius: 8,
                textAlign: 'center',
                backgroundColor: '#e3f2fd',
              }}
            >
              <Text size="sm" c="blue" fw={500}>
                Thả vào đây để thêm vào thư mục
              </Text>
            </Box>
          )}
        </Stack>
      </SortableContext>
    </Paper>
  );
}