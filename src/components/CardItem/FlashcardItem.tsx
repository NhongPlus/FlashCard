// src/components/CardItem/FlashcardItem.tsx - FIXED VERSION

import { Box, Group, Text, ActionIcon } from '@mantine/core';
import { IconMenu2, IconTrash } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './FlashcardItem.module.css';
import { FormTextInput } from '../Input/TextInput/TextInput';

type Props = {
    id: string;
    index: number;
    onRemove: () => void;
    frontCard: string;
    backCard: string;
    onChangeFront: (value: string) => void;
    onChangeBack: (value: string) => void;
    disabled?: boolean; // ✅ FIX #8: Add disabled prop
};

function FlashcardItem({
    index,
    onRemove,
    id,
    frontCard,
    backCard,
    onChangeFront,
    onChangeBack,
    disabled = false, // ✅ Default to false
}: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Box className={styles.box} ref={setNodeRef} style={style} {...attributes}>
            <Group mb="xs" justify="space-between">
                <Text fw={500}>{index}</Text>
                <Group gap="xs">
                    <ActionIcon
                        variant="transparent"
                        {...listeners}
                        style={{ cursor: 'grab' }}
                        disabled={disabled}
                    >
                        <IconMenu2 size={20} />
                    </ActionIcon>
                    <ActionIcon
                        color="red"
                        variant="transparent"
                        onClick={onRemove}
                        disabled={disabled}
                    >
                        <IconTrash size={20} />
                    </ActionIcon>
                </Group>
            </Group>

            <Group grow align="flex-start" gap="lg">
                <Box style={{ flex: 1 }}>
                    {/* ✅ FIX #1: Changed varlueImport to value */}
                    <FormTextInput
                        placeholder="Thuật ngữ"
                        value={frontCard}
                        onChange={(e) => onChangeFront(e.currentTarget.value)}
                        filled
                        disabled={disabled}
                    />
                </Box>
                <Box style={{ flex: 1 }}>
                    {/* ✅ FIX #1: Changed varlueImport to value */}
                    <FormTextInput
                        placeholder="Định nghĩa"
                        value={backCard}
                        onChange={(e) => onChangeBack(e.currentTarget.value)}
                        filled
                        disabled={disabled}
                    />
                </Box>
            </Group>
        </Box>
    );
}

export default FlashcardItem;