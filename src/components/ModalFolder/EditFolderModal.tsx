// src/pages/Folder/components/EditFolderModal.tsx

import { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Stack, ColorPicker, Text, Group, ActionIcon } from '@mantine/core';
import { IconFolder, IconTrash } from '@tabler/icons-react';
import { updateFolder } from '@/services/Folder';
import { notifications } from '@mantine/notifications';
import type { Folder } from '@/@types/folder';

interface EditFolderModalProps {
  opened: boolean;
  onClose: () => void;
  folder: Folder | null;
  onDelete?: (folder: Folder) => void;
}

const DEFAULT_COLORS = [
  '#4dabf7', '#40c057', '#fab005', '#ff6b6b', 
  '#9775fa', '#20c997', '#fd7e14', '#f06595'
];

export function EditFolderModal({ opened, onClose, folder, onDelete }: EditFolderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4dabf7');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setDescription(folder.description || '');
      setColor(folder.color || '#4dabf7');
    }
  }, [folder]);

  const handleSubmit = async () => {
    if (!folder || !name.trim()) {
      notifications.show({
        title: 'Lỗi',
        message: 'Vui lòng nhập tên thư mục',
        color: 'red',
      });
      return;
    }

    try {
      setLoading(true);
      await updateFolder(folder.id, {
        name: name.trim(),
        description: description.trim(),
        color,
      });
      
      notifications.show({
        title: 'Thành công',
        message: 'Đã cập nhật thư mục',
        color: 'green',
      });

      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể cập nhật thư mục',
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
      title="Chỉnh sửa thư mục"
      centered
      size="md"
    >
      <Stack gap="md">
        <TextInput
          label="Tên thư mục"
          placeholder="Ví dụ: Toán học"
          leftSection={<IconFolder size={16} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Textarea
          label="Mô tả"
          placeholder="Mô tả về thư mục này..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minRows={3}
        />

        <div>
          <Text size="sm" fw={500} mb="xs">Màu thư mục</Text>
          <ColorPicker
            value={color}
            onChange={setColor}
            format="hex"
            swatches={DEFAULT_COLORS}
            fullWidth
          />
        </div>

        <Group justify="space-between">
          {onDelete && folder && (
            <ActionIcon
              color="red"
              variant="subtle"
              size="lg"
              onClick={() => {
                onClose();
                onDelete(folder);
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          )}
          
          <Group ml="auto">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              leftSection={<IconFolder size={18} />}
            >
              Lưu
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}