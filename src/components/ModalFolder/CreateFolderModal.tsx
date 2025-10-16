// src/pages/Folder/components/CreateFolderModal.tsx

import { useState } from 'react';
import { Modal, TextInput, Textarea, Button, Stack, ColorPicker, Text } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import { createFolder } from '@/services/Folder';
import { notifications } from '@mantine/notifications';

interface CreateFolderModalProps {
  opened: boolean;
  onClose: () => void;
  userId: string;
}

const DEFAULT_COLORS = [
  '#4dabf7', '#40c057', '#fab005', '#ff6b6b', 
  '#9775fa', '#20c997', '#fd7e14', '#f06595'
];

export function CreateFolderModal({ opened, onClose, userId }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4dabf7');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      notifications.show({
        title: 'Lỗi',
        message: 'Vui lòng nhập tên thư mục',
        color: 'red',
      });
      return;
    }

    try {
      setLoading(true);
      await createFolder(userId, name.trim(), description.trim(), color);
      
      notifications.show({
        title: 'Thành công',
        message: 'Đã tạo thư mục mới',
        color: 'green',
      });

      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tạo thư mục',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setColor('#4dabf7');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Tạo thư mục mới"
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
          data-autofocus
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

        <Button
          fullWidth
          onClick={handleSubmit}
          loading={loading}
          leftSection={<IconFolder size={18} />}
        >
          Tạo thư mục
        </Button>
      </Stack>
    </Modal>
  );
}