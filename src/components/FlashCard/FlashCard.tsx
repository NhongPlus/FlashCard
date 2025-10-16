import { Paper, Title, Text, Flex, ActionIcon, Space } from '@mantine/core';
import { Flip } from '@gfazioli/mantine-flip';
import { IconVolume2 } from '@tabler/icons-react';
import { useSpeechSynthesis } from 'react-speech-kit';

interface FlashCardProps {
  term: string;
  definition: string;
  height: number;
  flipped: boolean;
  onFlip: () => void;
}

export function FlashCard({ term, definition, height, flipped, onFlip }: FlashCardProps) {
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // tránh click vào loa bị lật thẻ
    if (flipped) return; // ❌ không đọc khi đang ở mặt sau
    if (speaking) cancel();
    speak({ text: term }); 
  };
  return (
    <Flip h={height} w="100%" flipped={flipped} direction="vertical" duration={0.3} >
      {/* Front Side */}
      <Paper onClick={onFlip} withBorder shadow="md" radius="md" h={height} style={{ cursor: "pointer" }}>
        <Flex h="100%" direction="column" align="center" justify="space-between" p="xl">
          <ActionIcon variant="subtle" size="lg" onClick={handleSpeak} color={speaking ? "blue" : undefined}>
            <IconVolume2 />
          </ActionIcon>
          <Title order={2} c="black" ta="center" style={{ flex: 1, display: "flex", alignItems: "center" }}>
            {term}
          </Title>
          <Text size="sm" c="dimmed">Nhấn Space để lật thẻ</Text>
        </Flex>
      </Paper>

      {/* Back Side */}
      <Paper onClick={onFlip} withBorder shadow="md" radius="md" h={height} style={{ cursor: "pointer" }}>
        <Flex h="100%" direction="column" align="center" justify="space-between" p="xl">
          <Space />
          <Title order={2} c="black" ta="center" style={{ flex: 1, display: "flex", alignItems: "center" }}>
            {definition}
          </Title>
          <Text size="sm" c="dimmed">Nhấn Space để lật thẻ</Text>
        </Flex>
      </Paper>
    </Flip>
  );
}