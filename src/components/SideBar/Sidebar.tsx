// src/pages/Learning/components/Sidebar.tsx

import { Paper, Stack, Text, Box, Badge, Kbd, Group } from '@mantine/core';
import { type LearningMode } from '@/@types/learning';
import { type CardData } from '@/services';

interface SidebarProps {
    mode: LearningMode;
    allCards: CardData[];
    basicProgress: number;
    totalBasicCards: number;
    currentCard: CardData | undefined;
    viewedCardIds: Set<string>;
}

export function Sidebar({
    mode,
    allCards,
    basicProgress,
    totalBasicCards,
    currentCard,
    viewedCardIds,
}: SidebarProps) {
    const masteredCount = allCards.filter(c => c.isMastered).length;
    const unmasteredCount = allCards.length - masteredCount;

    return (
        <Paper p="md" withBorder>
            <Stack gap="md">
                <Text fw={600} size="lg">Tổng quan</Text>

                {mode === 'study' ? (
                    <>
                        <Box>
                            <Text size="sm" mb={8}>Đã thuộc</Text>
                            <Badge size="xl" variant="light" color="green" fullWidth>{masteredCount}</Badge>
                        </Box>
                        <Box>
                            <Text size="sm" mb={8}>Cần học lại</Text>
                            <Badge size="xl" variant="light" color="orange" fullWidth>{unmasteredCount}</Badge>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box>
                            <Text size="sm" mb={8}>Đã xem</Text>
                            <Badge size="xl" variant="light" color="cyan" fullWidth>{basicProgress}</Badge>
                        </Box>
                        <Box>
                            <Text size="sm" mb={8}>Chưa xem</Text>
                            <Badge size="xl" variant="light" color="gray" fullWidth>{totalBasicCards - basicProgress}</Badge>
                        </Box>
                    </>
                )}

                <Box mt="md" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: 8 }}>
                    <Text size="sm" fw={500} mb="xs">Phím tắt:</Text>
                    <Stack gap={4}>
                        <Group>
                            <Kbd>Space</Kbd>
                            <Text size="xs" c="dimmed">- Lật thẻ</Text>
                        </Group>
                        {mode === 'study' ? (
                            <>
                                <Group>
                                    <Kbd>←</Kbd>
                                    <Text size="xs" c="dimmed">- Chưa thuộc</Text>
                                </Group>
                                <Group>
                                    <Kbd>→</Kbd>
                                    <Text size="xs" c="dimmed">- Đã thuộc</Text>
                                </Group>
                            </>
                        ) : (
                            <>
                                <Group>
                                    <Kbd>←</Kbd>
                                    <Text size="xs" c="dimmed">- Thẻ trước</Text>
                                </Group>
                                <Group>
                                    <Kbd>→</Kbd>
                                    <Text size="xs" c="dimmed">- Thẻ tiếp theo</Text>
                                </Group>
                            </>
                        )}
                    </Stack>
                </Box>

                {currentCard && mode === 'basic' && viewedCardIds.has(currentCard.id) && (
                    <Badge color="cyan" variant="filled" size="lg" fullWidth>✓ Thẻ này đã xem</Badge>
                )}

                {currentCard && mode === 'study' && currentCard.isMastered && (
                    <Badge color="green" variant="filled" size="lg" fullWidth>✓ Thẻ này đã thuộc</Badge>
                )}
            </Stack>
        </Paper>
    );
}