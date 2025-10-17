// src/pages/AddCard/AddFlashCard.tsx - REFACTORED WITH MANTINE useForm

import { useState, useEffect } from 'react';
import { Container, Title, Stack, Button, Group, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useNavigate, useParams } from 'react-router-dom';

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

// Kiểu dữ liệu
type ClientCard = {
    id: string;
    frontCard: string;
    backCard: string;
};

// Constants
const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

function AddFlashCard() {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useAuth();
    const { id } = useParams();
    const isEditMode = !!id;

    const sensors = useSensors(useSensor(PointerSensor));

    // ✅ Mantine useForm for title & description
    const form = useForm({
        initialValues: {
            title: '',
            description: '',
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

    // Cards state
    const [cards, setCards] = useState<ClientCard[]>([
        { id: `new-${Date.now()}`, frontCard: '', backCard: '' },
    ]);
    const [originalCards, setOriginalCards] = useState<ClientCard[]>([]);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(isEditMode);



    // ✅ Effect để tải dữ liệu khi ở chế độ Edit - WITH FIX
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

                    // ✅ FIX: Fill form data đúng cách
                    form.setValues({
                        title: studySetData.title || '',
                        description: studySetData.description || '', // ← Handle undefined
                    });

                    const clientCards = cardsData.map(card => ({
                        id: card.id,
                        frontCard: card.front || '',
                        backCard: card.back || '',
                    }));

                    setCards(clientCards);
                    setOriginalCards(clientCards); // ✅ Lưu trạng thái gốc

                } catch (error) {
                    if (!isMounted) return;
                    console.error("Lỗi khi tải dữ liệu để chỉnh sửa:", error);
                    notifications.show({
                        title: 'Lỗi',
                        message: 'Không tìm thấy bộ thẻ hoặc đã có lỗi xảy ra khi tải dữ liệu.',
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
    // ✅ AUTHENTICATION CHECK - After all hooks
    if (userLoading) {
        return <LoadingScreen />;
    }
    // --- Các hàm quản lý thẻ ---
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
                message: 'Bạn phải điền ít nhất một thẻ hợp lệ (cả mặt trước và mặt sau).',
                color: 'red'
            });
            return false;
        }
        return true;
    };

    // --- Hàm xử lý chính khi Submit Form ---
    const handleSubmit = async (values: { title: string; description: string }) => {
        // Validate form
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
                message: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
                color: 'red'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Edit Mode Logic
    const handleEditMode = async (id: string, values: { title: string; description: string }) => {
        // 1️⃣ Validate phải có ít nhất 1 thẻ hợp lệ
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
            description: values.description.trim() || ''
        };

        const currentCardsMap = new Map(cards.map(c => [c.id, c]));

        // 2️⃣ Cards cần tạo - CHỈ card không trống
        const cardsToCreate = cards
            .filter(c => c.id.startsWith('new-') && c.frontCard.trim() && c.backCard.trim())
            .map((card) => ({
                front: card.frontCard.trim(),
                back: card.backCard.trim(),
                order: cards.findIndex(finalCard => finalCard.id === card.id),
                isMastered: false,
            }));

        // 3️⃣ Cards cần xóa
        const cardIdsToDelete = originalCards
            .filter(c => !currentCardsMap.has(c.id))
            .map(c => c.id);

        // 4️⃣ Cards cần update
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

    // ✅ Create Mode Logic
    const handleCreateMode = async (values: { title: string; description: string }) => {
        const validCards = getValidCards();

        const studySetData = {
            title: values.title.trim(),
            description: values.description.trim() || '',
            userId: user!.uid,
            folderId: null,
            language: { front: "en", back: "vi" },
            settings: { isPublic: true, allowCopy: true, shuffleCards: false },
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
            message: 'Đã tạo học phần mới!',
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
                            h={100} // chiều cao tùy ý
                            required={false}
                        />
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

                    <Button
                        fullWidth
                        variant="light"
                        mt="lg"
                        onClick={handleAddCard}
                        className={styles.addButton}
                        disabled={isLoadingData || isSubmitting}
                    >
                        + THÊM THẺ
                    </Button>

                    <Group justify="flex-end" mt="xl">
                        <ButtonBase
                            label={isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo')}
                            type="submit"
                            disabled={isSubmitting || isLoadingData}
                            fullWidth
                            variant="filled"
                        />
                    </Group>
                </form>
            </Container>
        </div>
    );
}

export default AddFlashCard;