import ModalCustom from './components/ModalCustom/ModalCustom';
import image from '@/assets/images/mind.png'
import useUserProfile from './utils/hooks/useUserProfile';
import LoadingScreen from './components/Layout/LoadingScreen/LoadingScreen';
import useAuth from './utils/hooks/useAuth';
import NullData from './components/NullData/NullData';
import style from './App.module.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, ThemeIcon, Text, Group, Container, SimpleGrid, Modal, Center, Loader, ScrollArea, Flex } from '@mantine/core';
import { IconBook2, IconFileDescriptionFilled } from '@tabler/icons-react';
import type { StudySetData } from './@types/learning';
import type { Folder } from './@types/folder';
import { useStudySets } from '@/utils/hooks/useStudySet';
import { useFolders } from './utils/hooks/useFolder';
import { useDisclosure } from '@mantine/hooks';
import { getStudySetsInFolder } from './services/Folder/folderService';

const text = `Lần đầu đăng kí?\nĐến trang cài đặt để thêm thông tin cá nhân`;


function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: loadingProfile, isProfileComplete } = useUserProfile();

  // States & Hooks cho Modal
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [studySetsInModal, setStudySetsInModal] = useState<StudySetData[]>([]);
  const [loadingModalContent, setLoadingModalContent] = useState(false);

  // State cho modal cảnh báo
  const [modalOpened, setModalOpened] = useState(false);

  // ✅ TỐI ƯU: Chỉ lấy các học phần chưa được phân loại để hiển thị ở trang chính
  const { studySets: unclassifiedStudySets, loading: loadingStudySets } = useStudySets(user?.uid);
  const { folders, loading: loadingFolders } = useFolders(user?.uid);

  // ✅ Check profile completeness
  useEffect(() => {
    if (!loadingProfile) {
      if (profile && !isProfileComplete) {
        setModalOpened(true);
      } else if (!profile) {
        setModalOpened(true);
      } else {
        setModalOpened(false);
      }
    }
  }, [loadingProfile, profile, isProfileComplete]);

  // Call studySet in folder 
  useEffect(() => {
    if (selectedFolder && opened && user?.uid) {
      const fetchSets = async () => {
        setLoadingModalContent(true);
        try {
          const sets = await getStudySetsInFolder(user.uid, selectedFolder.id);
          setStudySetsInModal(sets);
        } catch (error) {
          console.error("Lỗi khi tải học phần trong thư mục:", error);
        } finally {
          setLoadingModalContent(false);
        }
      };
      fetchSets();
    }
  }, [selectedFolder, opened, user?.uid]);
  console.log(folders);
  const handleCloseModal = () => {
    close();
    // Reset state khi đóng modal để lần sau mở lại không bị hiển thị dữ liệu cũ
    setSelectedFolder(null);
    setStudySetsInModal([]);
  }
  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder);
    open();
  };
  console.log(studySetsInModal);
  // Loading state
  if (loadingFolders || loadingStudySets) {
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

      {unclassifiedStudySets.length === 0 ? (
        <NullData />
      ) : (
        <div style={{ backgroundColor: '#F6F7FB' }}>
          <Container size={'lg'}>
            <Text fz={30} fw={700} py={30}>Học phần của bạn </Text>
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing="xl"
              pb={'60px'}
            >
              {unclassifiedStudySets.map((studySet: StudySetData) => (
                <Box
                  key={studySet.id}
                  p="md"
                  className={style.box}
                  onClick={() => navigate(`/learning/${studySet.id}`)}
                >
                  <Group>
                    <ThemeIcon variant="light" radius="md" size="xl" color="#008EC4">
                      <IconFileDescriptionFilled style={{ width: '70%', height: '70%' }} />
                    </ThemeIcon>

                    <Box style={{ flex: 1 }}>
                      <Text fw={600}>{studySet.title}</Text>
                      <Group gap={7}>
                        <Text size="sm" c="gray" className={style.root}>
                          Học phần
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
              {folders.map((folder: Folder) => (
                <Box
                  key={folder.id}
                  p="md"
                  className={style.box}
                  onClick={() => handleFolderClick(folder)}
                >
                  <Group>
                    <ThemeIcon variant="light" radius="md" size="xl" color="#008EC4">
                      <IconBook2 style={{ width: '70%', height: '70%' }} />
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text fw={600}>{folder.name}</Text>
                      <Group gap={7}>
                        <Text size="sm" c="gray" className={style.root}>
                          Thư mục
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

      {/* đây là phần mở modal của folder  */}
      <Modal opened={opened} onClose={handleCloseModal} title={`Học phần trong: ${selectedFolder?.name || ''}`} centered size="lg">
        <ScrollArea h={250} type="never" offsetScrollbars>
          <Flex gap={5} direction={'column'} bg='#fff'>
            {loadingModalContent ? (
              <Center p="xl"><Loader /></Center>
            ) : (
              studySetsInModal.length > 0 ? (
                studySetsInModal.map(studySet => (
                  <Box
                    key={studySet.id}
                    p="md"
                    className={style.box}
                    onClick={() => navigate(`/learning/${studySet.id}`)}
                  >
                    <Group>
                      <ThemeIcon variant="light" radius="md" size="xl" color="#008EC4">
                        <IconFileDescriptionFilled style={{ width: '70%', height: '70%' }} />
                      </ThemeIcon>

                      <Box style={{ flex: 1 }}>
                        <Text fw={600}>{studySet.title}</Text>
                        <Group gap={7}>
                          <Text size="sm" c="gray" className={style.root}>
                            Học phần
                          </Text>
                          •
                          <Text size="sm" c="dimmed" className={style.root}>
                            Tác giả : {profile?.displayName}
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                  </Box>
                ))
              ) : (
                <Text c="dimmed" ta="center" p="xl">Thư mục này chưa có học phần nào.</Text>
              )
            )}
          </Flex>
        </ScrollArea>
      </Modal>
    </>
  );
}

export default App;