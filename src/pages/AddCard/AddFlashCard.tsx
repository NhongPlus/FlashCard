// src/pages/AddCard/AddFlashCard.tsx - WITH PUBLIC/PRIVATE TOGGLE

import { useState, useEffect } from 'react';
import { Container, Title, Stack, Button, Group, Flex, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useNavigate, useParams } from 'react-router-dom';
import { IconLock, IconWorld } from '@tabler/icons-react';

import FlashcardItem from '@/components/CardItem/FlashcardItem';
import { FormTextInput } from '@/components/Input/TextInput/TextInput';
import LoadingScreen from '@/components/Layout/LoadingScreen/LoadingScreen';
import styles from './AddFlashCard.module.css';

import {
    createStudySetWithCards,
    getCardsInStudySet,
    getStudySet,
    updateStudySetWithCards,
} from '@/services';
import useAuth from '@/utils/hooks/useAuth';
import { notifications } from '@mantine/notifications';
import { FormTextarea } from '@/components/Input/TextArea/TextArea';
import { ButtonBase } from '@/components/Button/ButtonBase';

type ClientCard = {
    id: string;
    frontCard: string;
    backCard: string;
};

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

function AddFlashCard() {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useAuth();
    const { id } = useParams();
    const isEditMode = !!id;

    const sensors = useSensors(useSensor(PointerSensor));

    // ✅ Form with isPublic field
    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            isPublic: true, // ← Default là public
        },
        validate: {
            title: (value) => {
                if (!value.trim()) return 'Tiêu đề không được bỏ trống';
                if (value.trim().length < TITLE_MIN_LENGTH) return `Tiêu đề phải ít nhất ${TITLE_MIN_LENGTH} ký tự`;
                if (value.trim().length > TITLE_MAX_LENGTH) return `Tiêu đề không được vượt quá ${TITLE_MAX_LENGTH} ký tự`;
                return null;
            },
            description: (value) => {
                if (value.length > DESCRIPTION_MAX_LENGTH) return `Mô tả không được vượt quá ${DESCRIPTION_MAX_LENGTH} ký tự`;
                return null;
            },
        },
    });

    const [cards, setCards] = useState<ClientCard[]>([
        { id: `new-${Date.now()}`, frontCard: '', backCard: '' },
    ]);
    const [originalCards, setOriginalCards] = useState<ClientCard[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(isEditMode);

    useEffect(() => {
        let isMounted = true;
        if (isEditMode && id) {
            const fetchDataForEdit = async () => {
                try {
                    if (!isMounted) return;

                    const [studySetData, cardsData] = await Promise.all([
                        getStudySet(id),
                        getCardsInStudySet(id)
                    ]);

                    if (!isMounted) return;

                    if (!studySetData) {
                        throw new Error('Không tìm thấy bộ thẻ');
                    }

                    form.setValues({
                        title: studySetData.title || '',
                        description: studySetData.description || '',
                        isPublic: studySetData.isPublic ?? true, // ← Load isPublic
                    });

                    const clientCards = cardsData.map(card => ({
                        id: card.id,
                        frontCard: card.front || '',
                        backCard: card.back || '',
                    }));

                    setCards(clientCards);
                    setOriginalCards(clientCards);

                } catch (error) {
                    if (!isMounted) return;
                    console.error("Lỗi khi tải dữ liệu:", error);
                    notifications.show({
                        title: 'Lỗi',
                        message: 'Không tìm thấy bộ thẻ.',
                        color: 'red',
                    });
                    navigate('/dashboard');
                } finally {
                    if (isMounted) setIsLoadingData(false);
                }
            };
            fetchDataForEdit();
        }

        return () => {
            isMounted = false;
        };
    }, [isEditMode, id, navigate]);

    if (userLoading) {
        return <LoadingScreen />;
    }

    const handleAddCard = () => {
        setCards(prev => [
            ...prev,
            { id: `new-${Date.now()}`, frontCard: '', backCard: '' },
        ]);
    };

    const handleRemoveCard = (indexToRemove: number) => {
        if (cards.length > 1) {
            setCards(prev => prev.filter((_, index) => index !== indexToRemove));
        } else {
            notifications.show({
                message: 'Phải có ít nhất một thẻ.',
                color: 'yellow',
            });
        }
    };

    const handleChangeCard = (index: number, field: 'frontCard' | 'backCard', value: string) => {
        setCards(prev =>
            prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
        );
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCards(items => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const getValidCards = () => {
        return cards.filter(c => c.frontCard.trim() && c.backCard.trim());
    };

    const validateCards = (): boolean => {
        const validCards = getValidCards();
        if (validCards.length === 0) {
            notifications.show({
                title: 'Lỗi',
                message: 'Bạn phải điền ít nhất một thẻ hợp lệ.',
                color: 'red'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (values: { title: string; description: string; isPublic: boolean }) => {
        if (!form.isValid() || !validateCards()) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditMode && id) {
                await handleEditMode(id, values);
            } else {
                await handleCreateMode(values);
            }
        } catch (error) {
            console.error("Lỗi khi lưu học phần:", error);
            notifications.show({
                title: 'Lỗi',
                message: 'Đã có lỗi xảy ra.',
                color: 'red'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditMode = async (id: string, values: { title: string; description: string; isPublic: boolean }) => {
        const validCards = getValidCards();
        if (validCards.length === 0) {
            notifications.show({
                title: 'Lỗi',
                message: 'Bạn phải có ít nhất một thẻ hợp lệ.',
                color: 'red'
            });
            return;
        }

        const studySetUpdateData = {
            title: values.title.trim(),
            description: values.description.trim() || '',
            isPublic: values.isPublic, // ← Include isPublic
        };

        const currentCardsMap = new Map(cards.map(c => [c.id, c]));

        const cardsToCreate = cards
            .filter(c => c.id.startsWith('new-') && c.frontCard.trim() && c.backCard.trim())
            .map((card) => ({
                front: card.frontCard.trim(),
                back: card.backCard.trim(),
                order: cards.findIndex(finalCard => finalCard.id === card.id),
                isMastered: false,
            }));

        const cardIdsToDelete = originalCards
            .filter(c => !currentCardsMap.has(c.id))
            .map(c => c.id);

        const cardsToUpdate = originalCards
            .filter(c => currentCardsMap.has(c.id))
            .map(originalCard => {
                const currentCard = currentCardsMap.get(originalCard.id)!;
                const currentOrder = cards.findIndex(c => c.id === currentCard.id);
                const originalOrder = originalCards.findIndex(c => c.id === originalCard.id);

                if (
                    originalCard.frontCard !== currentCard.frontCard ||
                    originalCard.backCard !== currentCard.backCard ||
                    originalOrder !== currentOrder
                ) {
                    return {
                        id: currentCard.id,
                        data: {
                            front: currentCard.frontCard.trim(),
                            back: currentCard.backCard.trim(),
                            order: currentOrder,
                        }
                    };
                }
                return null;
            })
            .filter((c): c is { id: string; data: { front: string; back: string; order: number; } } => c !== null);

        await updateStudySetWithCards(
            id,
            studySetUpdateData,
            cardsToCreate,
            cardsToUpdate,
            cardIdsToDelete
        );

        notifications.show({
            title: 'Thành công',
            message: 'Đã cập nhật học phần!',
            color: 'green'
        });

        setTimeout(() => {
            navigate(`/learning/${id}`);
        }, 500);
    };

    const handleCreateMode = async (values: { title: string; description: string; isPublic: boolean }) => {
        const validCards = getValidCards();

        const studySetData = {
            title: values.title.trim(),
            description: values.description.trim() || '',
            userId: user!.uid,
            folderId: null,
            isPublic: values.isPublic, // ← Include isPublic
            language: { front: "en", back: "vi" },
            settings: { allowCopy: true, shuffleCards: false },
            tags: [],
            createdAt: new Date(),
        };

        const cardsData = validCards.map((card, index) => ({
            front: card.frontCard.trim(),
            back: card.backCard.trim(),
            order: index,
            isMastered: false,
        }));

        const newStudySetId = await createStudySetWithCards(studySetData, cardsData);

        notifications.show({
            title: 'Thành công',
            message: values.isPublic
                ? 'Đã tạo học phần công khai!'
                : 'Đã tạo học phần riêng tư!',
            color: 'green'
        });

        form.reset();
        setCards([{ id: `new-${Date.now()}`, frontCard: '', backCard: '' }]);

        setTimeout(() => {
            navigate(`/learning/${newStudySetId}`);
        }, 500);
    };

    if (isLoadingData) {
        return <LoadingScreen />;
    }

    return (
        <div style={{ backgroundColor: '#F6F7FB', paddingBottom: '40px' }}>
            <Container size={'lg'}>
                <Title order={2} mb="lg" py={20}>
                    {isEditMode ? 'Chỉnh sửa học phần' : 'Tạo một học phần mới'}
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Flex direction='column' gap={30}>
                        <FormTextInput
                            placeholder="Nhập tiêu đề..."
                            label='Tiêu đề'
                            {...form.getInputProps('title')}
                            filled={false}
                            disabled={isLoadingData || isSubmitting}
                            required
                        />
                        <FormTextarea
                            placeholder="Thêm mô tả..."
                            label='Mô tả (không bắt buộc)'
                            {...form.getInputProps('description')}
                            filled={false}
                            disabled={isLoadingData || isSubmitting}
                            h={100}
                            required={false}
                        />

                        {/* ✅ PUBLIC/PRIVATE TOGGLE */}
                        <Group
                            justify="space-between"
                            p="md"
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                border: '1px solid #e9ecef'
                            }}
                        >
                            <Group gap="xs">
                                {form.values.isPublic ? (
                                    <IconWorld size={20} color="#4dabf7" />
                                ) : (
                                    <IconLock size={20} color="#868e96" />
                                )}
                                <div>
                                    <Text fw={500} size="sm">
                                        {form.values.isPublic ? 'Công khai' : 'Riêng tư'}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {form.values.isPublic
                                            ? 'Mọi người có thể xem và tìm kiếm học phần này'
                                            : 'Chỉ bạn mới có thể xem học phần này'
                                        }
                                    </Text>
                                </div>
                            </Group>
                            <Switch
                                checked={form.values.isPublic}
                                onChange={(event) => form.setFieldValue('isPublic', event.currentTarget.checked)}
                                size="md"
                                disabled={isLoadingData || isSubmitting}
                            />
                        </Group>
                    </Flex>

                    <Stack my="xl" gap={40}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                                {cards.map((card, index) => (
                                    <FlashcardItem
                                        key={card.id}
                                        id={card.id}
                                        index={index + 1}
                                        onRemove={() => handleRemoveCard(index)}
                                        frontCard={card.frontCard}
                                        backCard={card.backCard}
                                        onChangeFront={(val) => handleChangeCard(index, 'frontCard', val)}
                                        onChangeBack={(val) => handleChangeCard(index, 'backCard', val)}
                                        disabled={isLoadingData || isSubmitting}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </Stack>
                    <Group justify="flex-end" mt="xl">
                        <Button
                            variant="light"
                            mt="lg"
                            onClick={handleAddCard}
                            className={styles.addButton}
                            disabled={isLoadingData || isSubmitting}
                        >
                            + THÊM THẺ
                        </Button>
                    </Group>
                    <Group justify="flex-end" mt="xl">
                        <ButtonBase
                            label={isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo')}
                            type="submit"
                            disabled={isSubmitting || isLoadingData}
                            variant="filled"
                        />
                    </Group>
                </form>
            </Container>
        </div>
    );
}

export default AddFlashCard;