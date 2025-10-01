import { getCardsInStudySet, getStudySet, updateCardMastery, type CardData, type StudySetData } from "@/services";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '@gfazioli/mantine-flip/styles.css';
import '@gfazioli/mantine-flip/styles.layer.css';
import { Flip } from '@gfazioli/mantine-flip';
import { 
  Grid, Text, Stack, Paper, Title, Container, Flex, Switch, 
  Progress, Button, Group, Badge, Box, ActionIcon 
} from '@mantine/core';
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { IconVolume2, IconArrowLeft, IconArrowRight, IconCheck, IconX } from "@tabler/icons-react";
import style from './Learning.module.css';

function FrontFlashCard({ onFlip, term, height }: { onFlip: () => void; term: string; height: number }) {
  return (
    <Paper onClick={onFlip} style={{ cursor: 'pointer' }} withBorder h={height} shadow="md" radius="md">
      <Flex className={style.card} h={'100%'} direction={'column'} align={'center'} justify={'space-between'} p="xl">
        <ActionIcon variant="subtle" size="lg">
          <IconVolume2 />
        </ActionIcon>
        <Title order={2} c="black" ta={'center'} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {term}
        </Title>
        <Text size="sm" c="dimmed">Click để lật thẻ</Text>
      </Flex>
    </Paper>
  );
}

function BackFlashCard({ onFlip, definition, height }: { onFlip: () => void; definition: string; height: number }) {
  return (
    <Paper onClick={onFlip} style={{ cursor: 'pointer' }} h={height} withBorder shadow="md" radius="md">
      <Flex className={style.card} h={'100%'} direction={'column'} align={'center'} justify={'space-between'} p="xl">
        <ActionIcon variant="subtle" size="lg">
          <IconVolume2 />
        </ActionIcon>
        <Title order={2} c="black" ta={'center'} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {definition}
        </Title>
        <Text size="sm" c="dimmed">Click để lật lại</Text>
      </Flex>
    </Paper>
  );
}

function Learning() {
  const [direction, setDirection] = useState<1 | -1>(1);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [flipped, { toggle, close }] = useDisclosure(false);
  const [index, setIndex] = useState(0);
  const [studySet, setStudySet] = useState<StudySetData | null>(null);
  const [studyMode, setStudyMode] = useState<boolean>(false); // false: all cards, true: only unmastered
  const [loading, setLoading] = useState(true);

  // Hotkeys
  useHotkeys([
    ['space', () => toggle()],
    ['ArrowRight', () => nextCard()],
    ['ArrowLeft', () => prevCard()],
  ]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [cardsData, studySetData] = await Promise.all([
          getCardsInStudySet(id),
          getStudySet(id)
        ]);
        
        setCards(cardsData);
        setStudySet(studySetData);
        setFilteredCards(cardsData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Filter cards based on study mode
  useEffect(() => {
    if (studyMode) {
      // Study mode: chỉ học những thẻ chưa mastered
      const unmasteredCards = cards.filter(card => !card.isMastered);
      setFilteredCards(unmasteredCards);
      setIndex(0); // Reset về thẻ đầu
    } else {
      // Normal mode: học tất cả
      setFilteredCards(cards);
    }
    close(); // Đóng flip khi đổi mode
  }, [studyMode, cards]);

  // Navigation
  function nextCard() {
    close();
    setDirection(1);
    setIndex((prev) => (prev + 1) % filteredCards.length);
  }

  function prevCard() {
    close();
    setDirection(-1);
    setIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  }

  // Mark card as mastered/unmastered
  async function markCardMastery(mastered: boolean) {
    const currentCard = filteredCards[index];
    if (!currentCard) return;

    try {
      await updateCardMastery(currentCard.id, mastered);
      
      // Update local state
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === currentCard.id ? { ...card, isMastered: mastered } : card
        )
      );

      // Auto next card khi đánh dấu trong study mode
      if (studyMode && mastered) {
        setTimeout(() => nextCard(), 500);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  }

  // Calculate progress
  const masteredCount = cards.filter(c => c.isMastered).length;
  const totalCount = cards.length;
  const progressPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  if (loading) {
    return <Container><Text>Đang tải...</Text></Container>;
  }

  if (filteredCards.length === 0) {
    return (
      <Container size="sm" mt="xl">
        <Paper p="xl" withBorder>
          <Stack align="center">
            <Title order={3}>
              {studyMode ? "Bạn đã học xong tất cả thẻ!" : "Chưa có thẻ nào"}
            </Title>
            <Text c="dimmed">
              {studyMode 
                ? "Chuyển về chế độ học thông thường để xem lại tất cả thẻ"
                : "Thêm thẻ mới để bắt đầu học"
              }
            </Text>
            <Group>
              {studyMode && (
                <Button onClick={() => setStudyMode(false)}>
                  Học tất cả thẻ
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const currentCard = filteredCards[index];

  return (
    <div style={{ backgroundColor: '#F6F7FB', minHeight: '100vh', padding: '20px' }}>
      <Container size="xl">
        {/* Header */}
        <Group justify="space-between" mb="xl">
          <Box>
            <Title order={2}>{studySet?.title || 'Học thẻ'}</Title>
            <Text size="sm" c="dimmed">
              {studySet?.description}
            </Text>
          </Box>
          <Button variant="subtle" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={9}>
            {/* Card counter */}
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={500}>
                {index + 1} / {filteredCards.length}
              </Text>
              <Group>
                <Switch
                  checked={studyMode}
                  onChange={(e) => setStudyMode(e.currentTarget.checked)}
                  label="Chế độ ghi nhớ"
                  labelPosition="left"
                />
              </Group>
            </Group>

            {/* Flashcard */}
            <Box style={{ width: "100%", height: 400, position: "relative" }} mb="md">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 60 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Flip
                    h={400}
                    w="100%"
                    flipped={flipped}
                    direction="vertical"
                    duration={0.4}
                  >
                    <FrontFlashCard
                      onFlip={toggle}
                      term={currentCard.front}
                      height={400}
                    />
                    <BackFlashCard
                      onFlip={toggle}
                      definition={currentCard.back}
                      height={400}
                    />
                  </Flip>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Controls */}
            <Stack gap="md">
              {/* Navigation */}
              <Group justify="center">
                <Button
                  variant="light"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={prevCard}
                  disabled={filteredCards.length <= 1}
                >
                  Trước
                </Button>
                <Button
                  variant="light"
                  rightSection={<IconArrowRight size={16} />}
                  onClick={nextCard}
                  disabled={filteredCards.length <= 1}
                >
                  Sau
                </Button>
              </Group>

              {/* Mastery buttons (chỉ hiện khi flipped) */}
              {flipped && (
                <Group justify="center">
                  <Button
                    color="red"
                    variant="light"
                    leftSection={<IconX size={16} />}
                    onClick={() => markCardMastery(false)}
                  >
                    Chưa thuộc
                  </Button>
                  <Button
                    color="green"
                    variant="light"
                    leftSection={<IconCheck size={16} />}
                    onClick={() => markCardMastery(true)}
                  >
                    Đã thuộc
                  </Button>
                </Group>
              )}

              {/* Progress bar */}
              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" c="dimmed">Tiến độ học tập</Text>
                  <Text size="sm" fw={500}>{progressPercentage}%</Text>
                </Group>
                <Progress 
                  value={progressPercentage} 
                  striped 
                  animated={progressPercentage < 100}
                  color={progressPercentage === 100 ? 'green' : 'blue'}
                />
              </Box>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Text fw={600} size="lg">Thuật ngữ trong học phần</Text>
                
                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" c="orange">Đang học</Text>
                    <Badge color="orange" variant="light">
                      {totalCount - masteredCount}
                    </Badge>
                  </Group>
                  <Progress 
                    value={totalCount > 0 ? ((totalCount - masteredCount) / totalCount) * 100 : 0} 
                    color="orange" 
                    size="sm"
                  />
                </Box>

                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" c="green">Đã thuộc</Text>
                    <Badge color="green" variant="light">
                      {masteredCount}
                    </Badge>
                  </Group>
                  <Progress 
                    value={progressPercentage} 
                    color="green" 
                    size="sm"
                  />
                </Box>

                <Box mt="md">
                  <Text size="sm" c="dimmed" mb="xs">Phím tắt:</Text>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">Space - Lật thẻ</Text>
                    <Text size="xs" c="dimmed">← → - Chuyển thẻ</Text>
                  </Stack>
                </Box>

                {currentCard.isMastered && (
                  <Badge color="green" variant="filled" size="lg" fullWidth>
                    Thẻ này đã thuộc
                  </Badge>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

export default Learning;