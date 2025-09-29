import { useState, useEffect } from 'react'
import './App.css'
import ModalCustom from './components/ModalCustom/ModalCustom';
import image from '@/assets/images/mind.png'
import { useNavigate } from 'react-router-dom';
import useUserProfile from './utils/hooks/useUserProfile';
import LoadingScreen from './components/Layout/LoadingScreen/LoadingScreen';
import useAuth from './utils/hooks/useAuth';
import NullData from './components/NullData/NullData';
const text = `Lần đầu đăng kí?\nĐến trang cài đặt để thêm thông tin cá nhân`;

function App() {
  const { user } = useAuth();
  const { profile, loading, isProfileComplete } = useUserProfile();
  const [modalOpened, setModalOpened] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (!loading) {
      if (profile && !isProfileComplete) {
        setModalOpened(true);
      } else if (!profile) {
        // User chưa có document -> show modal
        setModalOpened(true);
      } else {
        // Profile đầy đủ -> không show modal
        setModalOpened(false);
      }
    }
  }, [loading, profile, isProfileComplete]);

  if (loading) {
    return (
      <LoadingScreen />
    );
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
      {/* nếu chưa có thì sẽ  */}
      {<NullData />}

    </>
  );
}

export default App;