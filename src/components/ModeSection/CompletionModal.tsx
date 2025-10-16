// src/pages/Learning/components/CompletionModal.tsx

import { Modal, Stack, Text, Button, Group, Box } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import { IconRefresh, IconTargetArrow, IconArrowBack, IconRotate } from '@tabler/icons-react';
import type { LearningMode } from '@/@types/learning';

interface CompletionModalProps {
    opened: boolean;
    onClose: () => void;
    mode: LearningMode;
    totalCards: number;
    masteredCount: number;
    onReset?: () => void;
    onContinue?: () => void;
    onSelectMode: () => void;
    onRestartBasic?: () => void;
}

export function CompletionModal({
    opened,
    onClose,
    mode,
    totalCards,
    masteredCount,
    onReset,
    onContinue,
    onSelectMode,
    onRestartBasic
}: CompletionModalProps) {
    const unmasteredCount = totalCards - masteredCount;
    const percentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="md"
            title={'🎉 Hoàn thành!'}
        >
            <Stack align="center" gap="xl" py="xl">
                {mode === 'study' ? (
                    <>
                        {/* DonutChart for Study Mode */}
                        <DonutChart
                            data={[
                                { name: 'Đã biết', value: masteredCount, color: 'teal.6' },
                                { name: 'Đang học', value: unmasteredCount, color: 'orange.6' },
                            ]}
                            thickness={30}
                            size={200}
                            chartLabel={`${percentage}%`}
                        />

                        {/* Statistics */}
                        <Stack gap="xs" w="100%">
                            <Group justify="space-between">
                                <Group gap="xs">
                                    <Box w={12} h={12} bg="teal.6" style={{ borderRadius: 4 }} />
                                    <Text size="sm">Đã biết</Text>
                                </Group>
                                <Text size="sm" fw={600}>{masteredCount}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Group gap="xs">
                                    <Box w={12} h={12} bg="orange.6" style={{ borderRadius: 4 }} />
                                    <Text size="sm">Đang học</Text>
                                </Group>
                                <Text size="sm" fw={600}>{unmasteredCount}</Text>
                            </Group>
                        </Stack>

                        {/* Actions for Study Mode */}
                        <Stack gap="md" w="100%" mt="md">
                            {onReset && (
                                <Button
                                    fullWidth
                                    size="lg"
                                    leftSection={<IconRefresh size={20} />}
                                    onClick={onReset}
                                >
                                    Đặt lại Thẻ ghi nhớ
                                </Button>
                            )}

                            {unmasteredCount > 0 && onContinue && (
                                <Button
                                    fullWidth
                                    size="lg"
                                    variant="light"
                                    leftSection={<IconTargetArrow size={20} />}
                                    onClick={onContinue}
                                >
                                    Tập trung vào {unmasteredCount} thẻ còn lại
                                </Button>
                            )}

                            <Button
                                fullWidth
                                variant="light"
                                leftSection={<IconArrowBack size={20} />}
                                onClick={onSelectMode}
                            >
                                Chọn chế độ khác
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <>
                        {/* Basic Mode Completion */}
                        <Text size="lg" fw={600} ta="center">
                            Bạn đã xem hết {totalCards} thẻ
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                            Chúc mừng! Bạn đã hoàn thành việc xem qua tất cả các thẻ.
                        </Text>

                        {/* Actions for Basic Mode */}
                        <Stack gap="md" w="100%" mt="md">
                            {onRestartBasic && (
                                <Button
                                    fullWidth
                                    size="lg"
                                    leftSection={<IconRotate size={20} />}
                                    onClick={onRestartBasic}
                                >
                                    Học lại từ đầu
                                </Button>
                            )}

                            <Button
                                fullWidth
                                variant="light"
                                leftSection={<IconArrowBack size={20} />}
                                onClick={onSelectMode}
                            >
                                Chọn chế độ khác
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>
        </Modal>
    );
}