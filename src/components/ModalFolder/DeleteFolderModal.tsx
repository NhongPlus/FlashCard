// src/pages/Folder/components/DeleteFolderModal.tsx

import { useState } from 'react';
import { Modal, Text, Button, Group, Stack, Alert } from '@mantine/core';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { deleteFolder } from '@/services/Folder';
import { notifications } from '@mantine/notifications';
import type { Folder } from '@/@types/folder';

interface DeleteFolderModalProps {
  opened: boolean;
  onClose: () => void;
  folder: Folder | null;
}

export function DeleteFolderModal({ opened, onClose, folder }: DeleteFolderModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!folder) return;

    try {
      setLoading(true);
      await deleteFolder(folder.id);
      
      notifications.show({
        title: 'Đã xóa',
        message: `Thư mục "${folder.name}" đã được xóa. Các bộ thẻ đã được chuyển về "Chưa phân loại"`,
        color: 'green',
      });

      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể xóa thư mục',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Xóa thư mục"
      centered
      size="md"
    >
      <Stack gap="md">
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
          <Text size="sm">
            Bạn có chắc chắn muốn xóa thư mục này?
          </Text>
        </Alert>

        {folder && (
          <>
            <Text size="sm">
              Thư mục: <Text component="span" fw={600}>{folder.name}</Text>
            </Text>
            
            {folder.studySetCount > 0 && (
              <Text size="sm" c="dimmed">
                {folder.studySetCount} bộ thẻ sẽ được chuyển về "Chưa phân loại"
              </Text>
            )}
          </>
        )}

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={loading}
            leftSection={<IconTrash size={18} />}
          >
            Xóa thư mục
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}