import { useState } from 'react';
import { Container, Title, Button, Group, Grid, Text, Stack, Paper } from '@mantine/core';
import { IconFolderPlus } from '@tabler/icons-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent
} from '@dnd-kit/core';
import { notifications } from '@mantine/notifications';
import useAuth from '@/utils/hooks/useAuth';
import { useFolders } from '@/utils/hooks/useFolder';
import { useStudySets } from '@/utils/hooks/useStudySet';
import { moveStudySetToFolder } from '@/services/Folder';

// Components
import { UnclassifiedZone } from '@/components/UnclassifiedZone/UnclassifiedZone';
import { DroppableFolder } from '@/components/Droppable/DroppableFolder';
import { DraggableStudySet } from '@/components/Draggable/DraggableStudySet';
import { CreateFolderModal } from '@/components/ModalFolder/CreateFolderModal';
import { EditFolderModal } from '@/components/ModalFolder/EditFolderModal';
import { DeleteFolderModal } from '@/components/ModalFolder/DeleteFolderModal';

import type { Folder, StudySetInFolder } from '@/@types/folder';


function FolderPage() {
  const { user } = useAuth();
  const { folders, loading: foldersLoading } = useFolders(user?.uid);
  const { studySets, getByFolder, getUnclassified } = useStudySets(user?.uid);

  // Modals
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  // Drag & Drop
  const [activeStudySet, setActiveStudySet] = useState<StudySetInFolder | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement to start drag
      },
    })
  );

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const studySet = studySets.find(s => s.id === active.id);
    if (studySet) {
      setActiveStudySet(studySet);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveStudySet(null);

    // ✅ Check: Phải thả vào đúng drop zone
    if (!over) {
      console.log('Dropped outside valid zone');
      return;
    }

    const studySetId = active.id as string;
    const studySet = studySets.find(s => s.id === studySetId);

    if (!studySet) {
      console.error('Study set not found:', studySetId);
      return;
    }

    const sourceFolderId = studySet.folderId;

    // ✅ Determine target folder ID
    let targetFolderId: string | null = null;

    if (over.id === 'unclassified') {
      // Thả vào "Chưa phân loại"
      targetFolderId = null;
    } else {
      // Thả vào folder - Validate folder exists
      const targetFolder = folders.find(f => f.id === over.id);
      if (!targetFolder) {
        console.error('Target folder not found:', over.id);
        notifications.show({
          title: 'Lỗi',
          message: 'Thư mục không tồn tại',
          color: 'red',
        });
        return;
      }
      targetFolderId = targetFolder.id;
    }

    // Same location, no move needed
    if (sourceFolderId === targetFolderId) {
      console.log('Same location, skip move');
      return;
    }

    try {
      await moveStudySetToFolder(studySetId, targetFolderId, sourceFolderId);

      const targetName = targetFolderId
        ? folders.find(f => f.id === targetFolderId)?.name || 'thư mục'
        : 'Chưa phân loại';

      notifications.show({
        title: 'Đã di chuyển',
        message: `"${studySet.title}" → ${targetName}`,
        color: 'green',
      });
    } catch (error) {
      console.error('Move error:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể di chuyển bộ thẻ',
        color: 'red',
      });
    }
  };

  // Folder actions
  const handleEditFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setEditModalOpened(true);
  };

  const handleDeleteFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setDeleteModalOpened(true);
  };

  // Loading state
  if (foldersLoading) {
    return (
      <Container size="xl" mt="xl">
        <Text ta="center">Đang tải...</Text>
      </Container>
    );
  }

  const unclassifiedStudySets = getUnclassified();

  return (
    <div style={{ backgroundColor: '#F6F7FB' }}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Container size="xl" py="xl">
          {/* Header */}
          <Group justify="space-between" mb="xl">
            <div>
              <Title order={2}>Quản lý thư mục</Title>
              <Text size="sm" c="dimmed">
                Tổ chức bộ thẻ của bạn vào các thư mục
              </Text>
            </div>
            <Button
              leftSection={<IconFolderPlus size={18} />}
              onClick={() => setCreateModalOpened(true)}
            >
              Tạo thư mục
            </Button>
          </Group>

          {/* Main Layout */}
          <Grid>
            {/* Left Column - Unclassified Zone */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <UnclassifiedZone studySets={unclassifiedStudySets} />
            </Grid.Col>

            {/* Right Column - Folders */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="md">
                {folders.length === 0 ? (
                  <Paper p="xl" withBorder style={{ textAlign: 'center' }}>
                    <Text size="sm" c="dimmed" mb="md">
                      Chưa có thư mục nào
                    </Text>
                    <Button
                      variant="light"
                      leftSection={<IconFolderPlus size={18} />}
                      onClick={() => setCreateModalOpened(true)}
                    >
                      Tạo thư mục đầu tiên
                    </Button>
                  </Paper>
                ) : (
                  folders.map(folder => (
                    <DroppableFolder
                      key={folder.id}
                      folder={folder}
                      studySets={getByFolder(folder.id)}
                      onEditFolder={handleEditFolder}
                      onDeleteFolder={handleDeleteFolder}
                    />
                  ))
                )}
              </Stack>
            </Grid.Col>
          </Grid>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeStudySet ? (
              <div style={{ cursor: 'grabbing', opacity: 0.8 }}>
                <DraggableStudySet studySet={activeStudySet} />
              </div>
            ) : null}
          </DragOverlay>
        </Container>

        {/* Modals */}
        <CreateFolderModal
          opened={createModalOpened}
          onClose={() => setCreateModalOpened(false)}
          userId={user?.uid || ''}
        />

        <EditFolderModal
          opened={editModalOpened}
          onClose={() => {
            setEditModalOpened(false);
            setSelectedFolder(null);
          }}
          folder={selectedFolder}
          onDelete={handleDeleteFolder}
        />

        <DeleteFolderModal
          opened={deleteModalOpened}
          onClose={() => {
            setDeleteModalOpened(false);
            setSelectedFolder(null);
          }}
          folder={selectedFolder}
        />
      </DndContext>
    </div>
  );
}

export default FolderPage;