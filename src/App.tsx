import { useEffect, useState } from 'react'
import './App.css'
// import { Box, Button, Group, Input, Text } from '@mantine/core';
// import { useForm } from '@mantine/form';
// import { v4 as uuidv4 } from 'uuid';
// import { HeaderMenu } from './components/Header/HeaderMenu';
// import { getAuth, onAuthStateChanged } from '@firebase/auth';
// import { doc, getDoc } from "firebase/firestore";
// import useAuth from './utils/hooks/useAuth';
import { auth } from './config/firebase';
import { statusUser } from './services/userService';
import ModalCustom from './components/ModalCustom/ModalCustom';
import image from '@/assets/images/mind.png'
import { useNavigate } from 'react-router-dom';
function App() {
  const [modelOpened, setModalOpened] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const text = `Lần đầu đăng kí?\nĐến trang cài đặt để thêm thông tin cá nhân`
  useEffect(() => {
    if (!user?.uid) return;
    // iife hàm thực thi ngay
    (async () => {
      const hasUser = await statusUser(user.uid);
      if (!hasUser) {
        setModalOpened(true)
      }
    })();
  }, [user.uid])

  return (
    <>
      {modelOpened == true &&
        <ModalCustom
          text={text}
          textButton={'Đến cài đặt'}
          opened={modelOpened}
          image={image}
          onClick={() => {
            setModalOpened(false);
            navigate('/settings')
          }}
        />
      }
      <h1>
        Main ( Nếu mà có thẻ , tức là đọc trong document có card [ required ] thì sẽ show (toggle) )
      </h1>
    </>
  )
}

export default App
// const [flippedIds, setFlippedIds] = useState<string[]>([]);
// const [show, setShow] = useState(0);

// function moveCard(num: number) {
//   if (num == 1) {
//     setShow((prev) => prev + 1)
//     if (show == arrCard.length - 1) {
//       setShow(0)
//       setFlippedIds([])
//     }
//   }
//   else {
//     setShow((prev) => prev - 1)
//     if (show == 0) {
//       setShow(0)
//       setFlippedIds([])
//     }
//   }
// }



{/* <Text ta='center'>{show + 1} / {arrCard.length}</Text>
      <FlashCard cards={arrCard} show={show} flippedIds={flippedIds} setFlippedIds={setFlippedIds} /> */}
{/* <Group justify="space-between">
        <Button onClick={() => moveCard(0)}>Previous</Button>
        <Button onClick={() => moveCard(1)}>Next</Button>
      </Group> */}
// <h1>dsavjhgdas</h1>
