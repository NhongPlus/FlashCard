import { useState, useEffect } from 'react'
import ModalCustom from './components/ModalCustom/ModalCustom';
import image from '@/assets/images/mind.png'
import { useNavigate } from 'react-router-dom';
import useUserProfile from './utils/hooks/useUserProfile';
import LoadingScreen from './components/Layout/LoadingScreen/LoadingScreen';
import useAuth from './utils/hooks/useAuth';
import NullData from './components/NullData/NullData';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config/firebase';
import { Box, ThemeIcon, Text, Stack, Group, Container, SimpleGrid } from '@mantine/core';
import { IconBook2, IconFileDescriptionFilled } from '@tabler/icons-react';
import style from './App.module.css'
const text = `Lần đầu đăng kí?\nĐến trang cài đặt để thêm thông tin cá nhân`;

interface StudySet {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  [key: string]: any;
}

function App() {
  const { user } = useAuth();
  const { profile, loading, isProfileComplete } = useUserProfile();

  const [modalOpened, setModalOpened] = useState(false);
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [loadingStudySets, setLoadingStudySets] = useState(true);
  const navigate = useNavigate();

  // ✅ Check profile completeness
  useEffect(() => {
    if (!loading) {
      if (profile && !isProfileComplete) {
        setModalOpened(true);
      } else if (!profile) {
        setModalOpened(true);
      } else {
        setModalOpened(false);
      }
    }
  }, [loading, profile, isProfileComplete]);

  // ✅ Fetch study sets CỦA USER HIỆN TẠI
  useEffect(() => {
    async function getUserStudySets() {
      if (!user?.uid) {
        setLoadingStudySets(false);
        return;
      }

      try {
        setLoadingStudySets(true);

        // ✅ Query chỉ lấy study sets của user hiện tại
        const q = query(
          collection(db, "studySets"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        // ✅ Lưu vào state
        const studySetsData: StudySet[] = [];
        querySnapshot.forEach((doc) => {
          studySetsData.push({
            id: doc.id,
            ...doc.data()
          } as StudySet);
        });

        setStudySets(studySetsData);
        console.log(`Đã tải ${studySetsData.length} study sets:`, studySetsData);

      } catch (error) {
        console.error("Lỗi khi lấy study sets:", error);
      } finally {
        setLoadingStudySets(false);
      }
    }

    getUserStudySets();
  }, [user?.uid]); // ✅ Chỉ chạy khi user.uid thay đổi

  // Loading state
  if (loading || loadingStudySets) {
    return <LoadingScreen />;
  }
  return (
    <>
      {modalOpened && (
        <ModalCustom
          text={text}
          textButton={'Đến cài đặt'}
          opened={modalOpened}
          image={image}
          onClick={() => {
            setModalOpened(false);
            navigate('/settings');
          }}
        />
      )}

      {/* Hiển thị study sets */}
      {studySets.length === 0 ? (
        <NullData />
      ) : (
        <div style={{ backgroundColor: '#F6F7FB' }}>
          <Container size={'lg'}>
            <Text fz={30} fw={700} py={30}>Học phần của bạn </Text>
            <SimpleGrid
              cols={{ base: 1, sm: 2 }} // Hiển thị 1 cột trên màn hình nhỏ, 2 cột trên màn hình lớn hơn
              spacing="xl"
              pb={'60px'}
            >
              {studySets.map((studySet) => (
                <Box
                  key={studySet.id}
                  p="md"
                  className={style.box}
                  onClick={() => navigate(`/learning/${studySet.id}`)}
                >
                  <Group>
                    <ThemeIcon variant="light" radius="md" size="xl" color="#008EC4">
                      {studySet.folderId == null
                        ?
                        (<IconFileDescriptionFilled style={{ width: '70%', height: '70%' }} />)
                        :
                        (<IconBook2 style={{ width: '70%', height: '70%' }} />)
                      }
                    </ThemeIcon>

                    <Box style={{ flex: 1 }}>
                      <Text fw={600}>{studySet.title}</Text>
                      <Group gap={7}>
                        <Text size="sm" c="gray" className={style.root}>
                          {studySet.folderId == null ? 'Học phần' : 'Thư mục'}
                        </Text>
                        •
                        <Text size="sm" c="dimmed" className={style.root}>
                          {studySet.cardCount} thẻ
                        </Text>
                        •
                        <Text size="sm" c="dimmed" className={style.root}>
                          Tác giả : {profile?.displayName}
                        </Text>
                      </Group>
                    </Box>
                  </Group>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </div>
      )}
    </>
  );
}

export default App;