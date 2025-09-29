// src/components/CardItem/FlashcardItem.tsx (Tên file và component đã được chuẩn hóa)

import { Box, Group, Text, ActionIcon } from '@mantine/core';
import { IconMenu2, IconTrash } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './FlashcardItem.module.css';
import { FormTextInput } from '../Input/TextInput/TextInput';

type Props = {
    id: string; // ID tạm thời cho dnd-kit
    index: number;
    onRemove: () => void;
    // Props đã được đổi tên để khớp với model CardData
    frontCard: string;
    backCard: string;
    onChangeFront: (value: string) => void;
    onChangeBack: (value: string) => void;
};

function FlashcardItem({
    index,
    onRemove,
    id,
    frontCard,
    backCard,
    onChangeFront,
    onChangeBack,
}: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Box className={styles.box} ref={setNodeRef} style={style} {...attributes}>
            <Group mb="xs" justify="space-between">
                <Text fw={500}>{index + 1}</Text>
                <Group gap="xs">
                    <ActionIcon variant="transparent" {...listeners} style={{ cursor: 'grab' }}>
                        <IconMenu2 size={20} />
                    </ActionIcon>
                    <ActionIcon color="red" variant="transparent" onClick={onRemove}>
                        <IconTrash size={20} />
                    </ActionIcon>
                </Group>
            </Group>

            <Group grow align="flex-start" gap="lg">
                <Box style={{ flex: 1 }}>
                    {/* SỬA LỖI: Thêm value và onChange để kiểm soát input */}
                    <FormTextInput
                        placeholder="Thuật ngữ"
                        varlueImport={frontCard}
                        onChange={(e) => onChangeFront(e.currentTarget.value)}
                        filled
                    />
                </Box>
                <Box style={{ flex: 1 }}>
                    {/* SỬA LỖI: Thêm value và onChange để kiểm soát input */}
                    <FormTextInput
                        placeholder="Định nghĩa"
                        varlueImport={backCard}
                        onChange={(e) => onChangeBack(e.currentTarget.value)}
                        filled
                    />
                </Box>
            </Group>
        </Box>
    );
}

export default FlashcardItem;