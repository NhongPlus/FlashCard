// src/pages/Learning/Learning.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Text, Group, Box, Title, Button, Badge, Grid, Stack, Paper } from '@mantine/core';
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconArrowsShuffle, IconCheck, IconX } from "@tabler/icons-react";

// Types
import type { LearningMode, CardData, StudySetData } from '@/@types/learning';

// Components
import { FlashCard } from '@/components/FlashCard/FlashCard';
import { ModeSelectionModal } from '@/components/ModeSection/ModeSelectionModal';
import { CompletionModal } from '@/components/ModeSection/CompletionModal';
import { ProgressSection } from '@/components/Progress/ProgressSection';
import { Sidebar } from '@/components/SideBar/Sidebar';

// Hooks
import { useBasicMode } from '@/utils/hooks/useBasicMode';
import { useStudyMode } from '@/utils/hooks/useStudyMode';
import { useLearningData } from '@/utils/hooks/useLearningData';

import '@gfazioli/mantine-flip/styles.css';
import '@gfazioli/mantine-flip/styles.layer.css';

function Learning() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ========== DATA STATES ==========
  const { cards, setCards, studySet, loading } = useLearningData(id || '');
  const [displayCards, setDisplayCards] = useState<CardData[]>([]);

  // ========== MODE STATES ==========
  const [mode, setMode] = useState<LearningMode>(null);
  const [completedModalOpened, setCompletedModalOpened] = useState(false);

  // ========== NAVIGATION STATES ==========
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [flipped, { toggle, close }] = useDisclosure(false);

  // ========== CUSTOM HOOKS ==========
  const basicMode = useBasicMode({
    displayCards,
    index,
    setIndex,
    setDisplayCards,
    originalCards: cards,
    onComplete: () => setCompletedModalOpened(true),
    closeFlip: close
  });

  const studyMode = useStudyMode({
    displayCards,
    index,
    setIndex,
    cards,
    setCards,
    setDisplayCards,
    onComplete: () => setCompletedModalOpened(true),
    closeFlip: close
  });

  // ========== SYNC DISPLAY CARDS ==========
  useEffect(() => {
    if (cards.length > 0 && displayCards.length === 0) {
      setDisplayCards(cards);
    }
  }, [cards, displayCards.length]);

  // ========== HOTKEYS ==========
  useHotkeys([
    ['space', () => toggle()],
    ['ArrowRight', () => {
      if (mode === 'study') studyMode.handleMastery(true);
      else if (mode === 'basic') basicMode.handleNext();
    }],
    ['ArrowLeft', () => {
      if (mode === 'study') studyMode.handleMastery(false);
      else if (mode === 'basic') basicMode.handlePrev();
    }],
  ]);

  // ========== MODE SELECTION ==========
  function handleModeSelect(selectedMode: LearningMode) {
    setMode(selectedMode);
    
    if (selectedMode === 'study') {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setDisplayCards(shuffled);
    } else {
      setDisplayCards(cards);
    }
    
    setIndex(0);
    close();
  }

  function handleSelectNewMode() {
    setMode(null);
    setCompletedModalOpened(false);
    setIndex(0);
    setDisplayCards(cards);
    close();
  }

  // ========== CALCULATIONS ==========
  const totalCards = displayCards.length;
  const masteredCount = cards.filter(c => c.isMastered).length;
  const basicProgress = basicMode.viewedCardIds.size;
  const basicProgressPercent = totalCards > 0 ? (basicProgress / totalCards) * 100 : 0;
  const studyProgressPercent = totalCards > 0 ? (studyMode.reviewedCount / totalCards) * 100 : 0;
  const currentCard = displayCards[index];

  // ========== LOADING STATE ==========
  if (loading) {
    return <Container><Text size="lg" ta="center" mt="xl">Đang tải...</Text></Container>;
  }

  // ========== EMPTY STATE ==========
  if (cards.length === 0) {
    return (
      <Container size="sm" mt="xl">
        <Paper p="xl" withBorder>
          <Stack align="center">
            <Title order={3}>Chưa có thẻ nào</Title>
            <Text c="dimmed">Thêm thẻ mới để bắt đầu học</Text>
            <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div style={{ backgroundColor: "#F6F7FB", minHeight: "100vh", padding: 20 }}>
      <Container size="xl">
        {/* Mode Selection Modal */}
        <ModeSelectionModal opened={mode === null} onSelect={handleModeSelect} />

        {/* Completion Modal */}
        <CompletionModal
          opened={completedModalOpened}
          onClose={() => setCompletedModalOpened(false)}
          mode={mode}
          totalCards={cards.length}
          masteredCount={masteredCount}
          onReset={studyMode.handleReset}
          onContinue={studyMode.handleContinue}
          onSelectMode={handleSelectNewMode}
          onBackHome={() => navigate(-1)}
        />

        {/* Header */}
        <Group justify="space-between" mb="xl">
          <Box>
            <Title order={2}>{studySet?.title || "Học thẻ"}</Title>
            <Text size="sm" c="dimmed">{studySet?.description}</Text>
          </Box>
          <Group>
            {mode === 'basic' && (
              <Button
                variant={basicMode.isShuffled ? "filled" : "light"}
                leftSection={<IconArrowsShuffle size={16} />}
                onClick={basicMode.handleShuffle}
              >
                {basicMode.isShuffled ? "Bỏ Shuffle" : "Shuffle"}
              </Button>
            )}
            <Badge color={mode === 'study' ? 'red' : 'blue'} size="lg">
              {mode === 'study' ? '🎯 Study Mode' : '📖 Basic Mode'}
            </Badge>
            <Button variant="subtle" onClick={() => navigate(-1)}>Quay lại</Button>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 9 }}>
            {/* Card Counter */}
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={500}>Thẻ {index + 1} / {totalCards}</Text>
              {basicMode.isShuffled && <Badge color="grape" variant="light">Đã shuffle</Badge>}
            </Group>

            {/* Flashcard */}
            <Box style={{ width: "100%", height: 400, position: "relative" }} mb="md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 60 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                >
                  <FlashCard
                    term={currentCard.front}
                    definition={currentCard.back}
                    height={400}
                    flipped={flipped}
                    onFlip={toggle}
                  />
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Controls */}
            <Stack gap="md">
              {mode === 'basic' ? (
                <Group justify="center" gap="md">
                  <Button
                    size="lg"
                    variant="light"
                    leftSection={<IconArrowLeft size={20} />}
                    onClick={basicMode.handlePrev}
                    disabled={!basicMode.canGoPrev}
                    style={{ minWidth: 150 }}
                  >
                    Trước
                  </Button>
                  <Button
                    size="lg"
                    variant="light"
                    rightSection={<IconArrowRight size={20} />}
                    onClick={basicMode.handleNext}
                    disabled={!basicMode.canGoNext}
                    style={{ minWidth: 150 }}
                  >
                    Sau
                  </Button>
                </Group>
              ) : (
                <Group justify="center" gap="xl">
                  <Button
                    size="lg"
                    color="red"
                    variant="filled"
                    leftSection={<IconX size={20} />}
                    onClick={() => studyMode.handleMastery(false)}
                    style={{ minWidth: 180 }}
                  >
                    Chưa thuộc
                  </Button>
                  <Button
                    size="lg"
                    color="green"
                    variant="filled"
                    leftSection={<IconCheck size={20} />}
                    onClick={() => studyMode.handleMastery(true)}
                    style={{ minWidth: 180 }}
                  >
                    Đã thuộc
                  </Button>
                </Group>
              )}

              <ProgressSection
                mode={mode}
                current={mode === 'study' ? studyMode.reviewedCount : basicProgress}
                total={totalCards}
                percentage={mode === 'study' ? studyProgressPercent : basicProgressPercent}
              />
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Sidebar
              mode={mode}
              totalCards={cards.length}
              masteredCount={masteredCount}
              basicProgress={basicProgress}
              currentCardViewed={basicMode.viewedCardIds.has(currentCard.id)}
              currentCardMastered={currentCard.isMastered}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

export default Learning;