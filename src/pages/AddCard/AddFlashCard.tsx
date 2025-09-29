// src/pages/AddFlashCard/AddFlashCard.tsx (Tên file và component đã được chuẩn hóa)

import { useState } from 'react';
import { Container, Title, Box, Textarea, Stack, Button, Group } from '@mantine/core';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useNavigate } from 'react-router-dom'; // Giả sử bạn dùng react-router-dom

// Component con đã được refactor
import FlashcardItem from '@/components/CardItem/FlashcardItem';
import { FormTextInput } from '@/components/Input/TextInput/TextInput';
import { ButtonBase } from '@/components/Button/ButtonBase';
import styles from './AddFlashCard.module.css';

// IMPORT CÁC SERVICE VÀ HOOK CẦN THIẾT
import { createStudySetWithCards } from '@/services';
import useAuth from '@/utils/hooks/useAuth'; // Hook để lấy thông tin user

// Kiểu dữ liệu cho card ở state, khớp với FlashcardItem props
type ClientCard = {
    id: string; // ID tạm thời cho client
    frontCard: string;
    backCard: string;
};

function AddFlashCard() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Lấy user hiện tại
    const sensors = useSensors(useSensor(PointerSensor));

    // State cho form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState<ClientCard[]>([
        { id: Date.now().toString(), frontCard: '', backCard: '' },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddCard = () => {
        setCards((prev) => [
            ...prev,
            { id: (Date.now() + Math.random()).toString(), frontCard: '', backCard: '' },
        ]);
    };

    const handleRemoveCard = (index: number) => {
        if (cards.length > 1) { // Luôn giữ lại ít nhất 1 thẻ
            setCards((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleChangeCard = (index: number, field: 'frontCard' | 'backCard', value: string) => {
        setCards((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        );
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCards((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // HÀM SUBMIT ĐÃ ĐƯỢC KẾT NỐI VỚI FIREBASE
    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('Tiêu đề không được bỏ trống');
            return;
        }
        const validCards = cards.filter(c => c.frontCard.trim() && c.backCard.trim());
        if (validCards.length === 0) {
            alert('Bạn phải điền ít nhất một thẻ hợp lệ (cả thuật ngữ và định nghĩa).');
            return;
        }

        setIsSubmitting(true);

        // 1. Chuẩn bị dữ liệu studySet theo model StudySetData
        const studySetData = {
            title,
            description: description || '',
            userId: user.uid,
            folderId: null, // Mặc định không thuộc folder nào khi mới tạo
            // Các trường khác từ model StudySetData của bạn
            language: { front: "en", back: "vi" },
            settings: { isPublic: true, allowCopy: true, shuffleCards: false },
            tags: [],
        };

        // 2. Chuẩn bị dữ liệu cards theo model CardData (bỏ đi id tạm thời)
        const cardsData = validCards.map((card, index) => ({
            front: card.frontCard,
            back: card.backCard,
            order: index,
            isMastered: false,
        }));

        try {
            // 3. Gọi service từ compositeService
            const newStudySetId = await createStudySetWithCards(studySetData, cardsData);
            navigate(`/study-set/${newStudySetId}`);
        } catch (error) {
            console.error("Failed to create study set:", error);
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#F6F7FB', paddingBottom: '40px' }}>
            <Container size={'lg'}>
                <Title order={2} mb="lg" py={20}>
                    Tạo một học phần mới
                </Title>

                {/* SỬA LỖI: Thêm value và onChange để kiểm soát input */}
                <FormTextInput
                    placeholder="Nhập tiêu đề, ví dụ 'Từ vựng tiếng Anh chủ đề động vật'"
                    label='Tiêu đề'
                    varlueImport={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    mb="md"
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
                                    index={index}
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
                        label={isSubmitting ? 'Đang tạo...' : 'Tạo'}
                        onClick={handleSubmit}
                        disable={isSubmitting}
                        fullWidth={false}
                    />
                </Group>
            </Container>
        </div>
    );
}

export default AddFlashCard;