// src/pages/Folder/components/DraggableStudySet.tsx

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Group, Text, Badge, ActionIcon, Stack } from '@mantine/core';
import { IconBook, IconGripVertical, IconTrash, IconEdit } from '@tabler/icons-react';
import type { StudySetInFolder } from '@/@types/folder';

interface DraggableStudySetProps {
  studySet: StudySetInFolder;
  onEdit?: (studySet: StudySetInFolder) => void;
  onDelete?: (studySet: StudySetInFolder) => void;
}

export function DraggableStudySet({ studySet, onEdit, onDelete }: DraggableStudySetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: studySet.id,
    data: {
      type: 'studyset',
      studySet,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <Paper
      ref={setNodeRef}
      p="md"
      withBorder
      shadow={isDragging ? 'lg' : 'sm'}
      radius="md"
      style={(theme) => ({
        ...style,
        backgroundColor: isDragging ? theme.colors.blue[0] : 'white',
        border: isDragging ? `2px solid ${theme.colors.blue[4]}` : undefined,
        boxShadow: isDragging ? undefined : theme.shadows.md,
        transform: isDragging ? undefined : 'translateY(-2px)',
        transition: 'all 0.2s ease',
      })}
    >
      <Group wrap="nowrap" gap="xs">
        {/* Drag Handle */}
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab' }}
        >
          <IconGripVertical size={18} />
        </ActionIcon>

        {/* Content */}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap">
            <IconBook size={18} color="#4dabf7" />
            <Text fw={600} size="sm" truncate style={{ flex: 1 }}>
              {studySet.title}
            </Text>
            <Badge variant="light" size="sm">
              {studySet.cardCount} thẻ
            </Badge>
          </Group>
          
          {studySet.description && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {studySet.description}
            </Text>
          )}
        </Stack>

        {/* Actions */}
        <Group gap={4}>
          {onEdit && (
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(studySet);
              }}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(studySet);
              }}
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Group>
      </Group>
    </Paper>
  );
}