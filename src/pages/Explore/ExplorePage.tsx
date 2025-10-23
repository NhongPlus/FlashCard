import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container, Title, TextInput, Box, Text, Group, Stack, Paper,
  Tabs, Badge, Avatar, Button, Select, Loader, Center, ActionIcon,
  Divider,
  SimpleGrid,
  Modal,
  Pill,
  Space
} from '@mantine/core';
import {
  IconSearch, IconFileDescription, IconWorld, IconUser,
  IconStar, IconClock, IconRefresh, IconFolder
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

// Mock data - Replace with real API
const mockStudySets = [
  {
    id: '1',
    title: 'Essential English Vocabulary',
    description: 'Master 500+ common English words for everyday conversation',
    cardCount: 523,
    creatorName: 'John Smith',
    creatorAvatar: null,
    isVerified: true,
    studyCount: 12453,
    createdAt: '2024-01-15',
    preview: ['Hello - Xin chào', 'Goodbye - Tạm biệt', 'Thank you - Cảm ơn']
  },
  {
    id: '2',
    title: 'IELTS Vocabulary 7.0+',
    description: 'Advanced vocabulary for IELTS exam preparation',
    cardCount: 892,
    creatorName: 'Sarah Johnson',
    creatorAvatar: null,
    isVerified: false,
    studyCount: 8932,
    createdAt: '2024-02-20',
    preview: ['Abundant - Phong phú', 'Coherent - Mạch lạc', 'Drastic - Quyết liệt', 'Drastic - Quyết liệt']
  },
  {
    id: '3',
    title: 'Business English Terms',
    description: 'Professional vocabulary for business communication',
    cardCount: 345,
    creatorName: 'Mike Chen',
    creatorAvatar: null,
    isVerified: true,
    studyCount: 5621,
    createdAt: '2024-03-10',
    preview: ['Revenue - Doanh thu', 'Stakeholder - Bên liên quan', 'Strategy - Chiến lược']
  }
];

export default function QuizletStyleExplore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryFromUrl = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  // Mock filtered results
  const filteredStudySets = mockStudySets.filter(set =>
    searchQuery ? set.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  useEffect(() => {
    if (queryFromUrl) setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  return (
    <Box style={{ backgroundColor: '#f6f7fb', minHeight: '100vh' }}>
      <Container size="lg" py={40}>
        <Stack gap="xl">
          {/* Header with Search */}
          <Box>
            <Group justify="space-between" mb="lg">
              <div>
                <Title order={2}>
                  {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Khám phá học phần'}
                </Title>
              </div>
              <ActionIcon variant="light" size="lg">
                <IconRefresh size={20} />
              </ActionIcon>
            </Group>
          </Box>

          {/*  Sort */}
          <Select
            placeholder="Sắp xếp"
            value={sortBy}
            onChange={(val) => setSortBy(val || 'relevance')}
            data={[
              { value: 'relevance', label: 'Liên quan nhất' },
              { value: 'recent', label: 'Mới nhất' },
              { value: 'popular', label: 'Phổ biến nhất' },
              { value: 'alphabetical', label: 'A → Z' }
            ]}
            style={{ width: 180 }}
          />

          {/* Results */}
          {loading ? (
            <Center py={60}>
              <Loader size="lg" />
            </Center>
          ) : filteredStudySets.length === 0 ? (
            <Center py={60}>
              <Stack align="center" gap="sm">
                <IconWorld size={64} color="#adb5bd" stroke={1.5} />
                <Title order={3} c="dimmed">Không tìm thấy kết quả</Title>
                <Text c="dimmed" size="sm">
                  Thử tìm kiếm với từ khóa khác
                </Text>
              </Stack>
            </Center>
          ) : (
            <Stack gap="md">
              <SimpleGrid cols={3}>
                {filteredStudySets.map((set) => (
                  <Paper
                    key={set.id}
                    p="xl"
                    shadow="xs"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                    onClick={() => {
                      navigate(`/learning/${set.id}`);
                    }}
                  >
                    <Stack gap="md">
                      <Group justify='space-between'>
                        <Text size="xs" c="dimmed">
                          <Group gap={5}>
                            <IconClock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            {new Date(set.createdAt).toLocaleDateString('vi-VN')}
                          </Group>
                        </Text>
                        <Pill fw={600} c={'#2E3856'}>{set.cardCount} thuật ngữ</Pill>
                      </Group>
                      <div>
                        <Title order={4} mb={4} lineClamp={1}>{set.title}</Title>
                        <Text size="sm" c="dimmed" lineClamp={1} truncate>
                          {set.description}
                        </Text>
                      </div>
                      <Modal opened={opened} onClose={close} centered>
                        <Stack gap={6}>
                          {set.preview.map((term, idx) => (
                            <Text key={idx} size="sm">
                              {term}
                            </Text>
                          ))}
                        </Stack>
                      </Modal>
                      <Space h="xl" />
                      {/* Footer */}
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Avatar size="sm" radius="xl" color="blue">
                            {set.creatorName.charAt(0)}
                          </Avatar>
                          <Text size="sm" fw={500}>{set.creatorName}</Text>
                        </Group>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={open}
                        >
                          XEM TRƯỚC
                        </Button>
                      </Group>
                    </Stack>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box >
  );
}