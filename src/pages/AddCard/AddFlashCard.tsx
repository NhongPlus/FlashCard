// src/pages/AddCard/AddFlashCard.tsx

import { useState, useEffect } from 'react';
import { Container, Title, Textarea, Stack, Button, Group } from '@mantine/core';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useNavigate, useParams } from 'react-router-dom';

import FlashcardItem from '@/components/CardItem/FlashcardItem';
import { FormTextInput } from '@/components/Input/TextInput/TextInput';
import { ButtonBase } from '@/components/Button/ButtonBase';
import LoadingScreen from '@/components/Layout/LoadingScreen/LoadingScreen';
import styles from './AddFlashCard.module.css';

import {
    createStudySetWithCards,
    getCardsInStudySet,
    getStudySet,
    updateStudySetWithCards, // Sử dụng hàm service tối ưu
} from '@/services';
import useAuth from '@/utils/hooks/useAuth';
import { notifications } from '@mantine/notifications'; // Tùy chọn: Dùng thông báo của Mantine

// Kiểu dữ liệu cho thẻ ở state
type ClientCard = {
    id: string; // ID thật từ DB hoặc ID tạm thời ở client
    frontCard: string;
    backCard: string;
};

function AddFlashCard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { studySetId } = useParams();
    const isEditMode = !!studySetId;

    const sensors = useSensors(useSensor(PointerSensor));

    // State cho form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState<ClientCard[]>([
        { id: `new-${Date.now()}`, frontCard: '', backCard: '' },
    ]);

    // State để lưu trữ thẻ gốc khi ở chế độ edit, dùng để so sánh
    const [originalCards, setOriginalCards] = useState<ClientCard[]>([]);

    // State quản lý UI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(isEditMode);

    // Effect để tải dữ liệu khi ở chế độ Edit
    useEffect(() => {
        if (isEditMode && studySetId) {
            const fetchDataForEdit = async () => {
                try {
                    const [studySetData, cardsData] = await Promise.all([
                        getStudySet(studySetId),
                        getCardsInStudySet(studySetId)
                    ]);

                    setTitle(studySetData.title);
                    setDescription(studySetData.description);

                    const clientCards = cardsData.map(card => ({
                        id: card.id,
                        frontCard: card.front,
                        backCard: card.back,
                    }));

                    setCards(clientCards);
                    setOriginalCards(clientCards); // Lưu lại trạng thái gốc để so sánh

                } catch (error) {
                    console.error("Lỗi khi tải dữ liệu để chỉnh sửa:", error);
                    notifications.show({
                        title: 'Lỗi',
                        message: 'Không tìm thấy bộ thẻ hoặc đã có lỗi xảy ra khi tải dữ liệu.',
                        color: 'red',
                    });
                    navigate('/dashboard');
                } finally {
                    setIsLoadingData(false);
                }
            };
            fetchDataForEdit();
        }
    }, [isEditMode, studySetId, navigate]);

    // --- Các hàm quản lý thẻ trên UI ---
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

    // --- Hàm xử lý chính khi Submit Form ---
    const handleSubmit = async () => {
        if (!title.trim()) {
            notifications.show({ title: 'Lỗi', message: 'Tiêu đề không được bỏ trống', color: 'red' });
            return;
        }
        const validCards = cards.filter(c => c.frontCard.trim() && c.backCard.trim());
        if (validCards.length === 0) {
            notifications.show({ title: 'Lỗi', message: 'Bạn phải điền ít nhất một thẻ hợp lệ (cả mặt trước và mặt sau).', color: 'red' });
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditMode && studySetId) {
                // ========== CHẾ ĐỘ EDIT: So sánh và cập nhật ==========
                const studySetUpdateData = { title, description: description || '' };
                const currentCardsMap = new Map(cards.map(c => [c.id, c]));

                const cardsToCreate = cards
                    .filter(c => c.id.startsWith('new-'))
                    .map(card => ({
                        front: card.frontCard,
                        back: card.backCard,
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
                                    front: currentCard.frontCard,
                                    back: currentCard.backCard,
                                    order: currentOrder,
                                }
                            };
                        }
                        return null;
                    }).filter((c): c is { id: string; data: any; } => c !== null);

                await updateStudySetWithCards(
                    studySetId,
                    studySetUpdateData,
                    cardsToCreate,
                    cardsToUpdate,
                    cardIdsToDelete
                );

                notifications.show({ title: 'Thành công', message: 'Đã cập nhật học phần!', color: 'green' });
                navigate(`/learning/${studySetId}`);

            } else {
                // ========== CHẾ ĐỘ CREATE: Tạo mới ==========
                const studySetData = {
                    title,
                    description: description || '',
                    userId: user.uid,
                    folderId: null,
                    language: { front: "en", back: "vi" },
                    settings: { isPublic: true, allowCopy: true, shuffleCards: false },
                    tags: [],
                    createdAt: new Date(), // Sẽ được ghi đè bởi serverTimestamp
                };
                const cardsData = validCards.map((card, index) => ({
                    front: card.frontCard,
                    back: card.backCard,
                    order: index,
                    isMastered: false,
                }));

                const newStudySetId = await createStudySetWithCards(studySetData, cardsData);
                notifications.show({ title: 'Thành công', message: 'Đã tạo học phần mới!', color: 'green' });
                navigate(`/learning/${newStudySetId}`);
            }
        } catch (error) {
            console.error("Lỗi khi lưu học phần:", error);
            notifications.show({ title: 'Lỗi', message: 'Đã có lỗi xảy ra. Vui lòng thử lại.', color: 'red' });
        } finally {
            setIsSubmitting(false);
        }
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

                <FormTextInput
                    placeholder="Nhập tiêu đề, ví dụ 'Từ vựng tiếng Anh chủ đề động vật'"
                    label='Tiêu đề'
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    filled
                />
                <Textarea
                    placeholder="Thêm mô tả để học phần của bạn hấp dẫn hơn..."
                    label='Mô tả (không bắt buộc)'
                    autosize
                    minRows={2}
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                />

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
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </Stack>

                <Button fullWidth variant="light" mt="lg" onClick={handleAddCard} className={styles.addButton}>
                    + THÊM THẺ
                </Button>

                <Group justify="flex-end" mt="xl">
                    <ButtonBase
                        label={isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo')}
                        onClick={handleSubmit}
                        disable={isSubmitting || isLoadingData}
                        fullWidth={false}
                    />
                </Group>
            </Container>
        </div>
    );
}

export default AddFlashCard;