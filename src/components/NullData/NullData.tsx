import { Center, Flex, Image, Text } from "@mantine/core";
import classes from './NullData.module.css'
import Null from '@/assets/ErrorPage/NullData.svg'
import { ButtonBase } from "../Button/ButtonBase";
import { useNavigate } from "react-router-dom";
export default function NullData() {
  const navigator = useNavigate()
  return (
    <>
      <Center bg="#F6F7FB" pt={60}>
        <Flex direction={'column'} gap={30} align={'center'}>
          <Text className={classes.text}>Bắt đầu tạo bài học mới</Text>
          <Image src={Null} w={500} />
          <ButtonBase fullWidth={false} label="Tạo Mới Flashcard" onClick={()=> navigator('/add')}/>
        </Flex>
      </Center>
    </>
  )
}
