// src/pages/Learning/components/FlashCard.tsx

import { Flip } from '@gfazioli/mantine-flip';
import { Paper, Flex, ActionIcon, Title, Text, Kbd } from '@mantine/core';
import { IconVolume2 } from '@tabler/icons-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import style from './FlashCard.module.css';
import '@gfazioli/mantine-flip/styles.css';
import '@gfazioli/mantine-flip/styles.layer.css';
interface FlashCardProps {
  term: string;
  definition: string;
  height: number;
  flipped: boolean;
  onFlip: () => void;
}

export function FlashCard({ term, definition, height, flipped, onFlip }: FlashCardProps) {
  const { speak } = useSpeechSynthesis();

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra Paper và gây lật thẻ
    speak({ text });
  };

  return (
    <Flip h={height} w="100%" flipped={flipped} direction="vertical">
      {/* Front Side */}
      <Paper onClick={onFlip} withBorder shadow="md" radius="md" h={height} style={{ cursor: "pointer" }}>
        <Flex className={style.card} h="100%" p="xl">
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={(e) => handleSpeak(e, term)}
          >
            <IconVolume2 />
          </ActionIcon>
          <Title order={2} className={style.titleCard}>
            {term}
          </Title>
          <Text size="sm" c="dimmed">Nhấn <Kbd>Space</Kbd> hoặc click để lật thẻ</Text>
        </Flex>
      </Paper>

      {/* Back Side */}
      <Paper onClick={onFlip} withBorder shadow="md" radius="md" h={height} style={{ cursor: "pointer" }}>
        <Flex className={style.card} h="100%" p="xl">
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={(e) => handleSpeak(e, definition)}
          >
            <IconVolume2 />
          </ActionIcon>
          <Title order={2} className={style.titleCard}>
            {definition}
          </Title>
           <Text size="sm" c="dimmed">Nhấn <Kbd>Space</Kbd> hoặc click để lật lại</Text>
        </Flex>
      </Paper>
    </Flip>
  );
}