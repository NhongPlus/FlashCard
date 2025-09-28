import { Text, Container, Flex, SimpleGrid, Divider, Group, ActionIcon, Image, Anchor, Box } from "@mantine/core";
import style from './Footer.module.css'
import { IconBrandLinkedinFilled } from '@tabler/icons-react';
import { IconBrandFacebookFilled } from '@tabler/icons-react';
import { IconBrandInstagramFilled } from '@tabler/icons-react';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import Certificate from '@/assets/images/image.png'
import TextQrCode from '@/assets/images/text_qrcode.png'
function Footer() {
  return (
    <>
      <div style={{ backgroundColor: '#F6F7FB' }}>
        <Container size={'xl'} p={0} pt={30}>
          <SimpleGrid cols={5}>
            <Flex direction={'column'} >
              <Text className={style.headText}>Giới thiệu</Text>
              <Flex direction={'column'} gap={16}>
                <Text className={style.contentText}>
                  <Link to='/mission'>Giới thiệu về Quizlet</Link>
                </Text>
              </Flex>
            </Flex>

            <Flex direction={'column'} >
              <Text className={style.headText}>Dành cho học sinh</Text>
              <Flex direction={'column'} gap={16} >
                <Text className={style.contentText}>
                  Thẻ ghi nhớ
                </Text>
                <Text className={style.contentText}>
                  Kiểm tra
                </Text>
                <Text className={style.contentText}>
                  Học
                </Text>
                <Text className={style.contentText}>
                  Nhóm học
                </Text>
                <Text className={style.contentText}>
                  {/* <Link to='/login'>Pomodoro</Link> */}
                </Text>
              </Flex>
            </Flex>

            <Flex direction={'column'} >
              <Text className={style.headText}>Dành cho giáo viên</Text>
              <Flex direction={'column'} gap={16} >
                <Text className={style.contentText}>
                  Live
                </Text>
              </Flex>
            </Flex>

            <Flex direction={'column'} >
              <Text className={style.headText}>Tài nguyên</Text>
              <Flex direction={'column'} gap={16}>
                <Text className={style.contentText}>
                  Trung tâm hỗ trợ
                </Text>
                <Text className={style.contentText}>
                  <Link to='/register'>Đăng kí</Link>
                </Text>
                <Text className={style.contentText}>
                  Điều khoản
                </Text>
              </Flex>
            </Flex>

            <Flex direction={'column'} >
              <Text className={style.headText}>Ngôn ngữ</Text>
              <Flex direction={'column'} gap={16}>
                <Text className={style.contentText}>
                  <Link to='/login'>Tiếng việt</Link>
                </Text>
                <Box p={3} >
                  <Image src={TextQrCode} w={180} />
                </Box>
              </Flex>
            </Flex>
          </SimpleGrid>

          <Divider my="xl" />

          <Group pb={40} justify="space-between">
            <Group>
              <Anchor href="https://www.linkedin.com/in/long-nguy%E1%BB%85n-ng%E1%BB%8Dc-b%E1%BA%A3o-7b6a38350/" target="_blank" >
                <ActionIcon variant="transparent" color="gray" size="lg" radius="xl" classNames={{ root: style.icon }}>
                  <IconBrandLinkedinFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Anchor>

              <Anchor href="https://github.com/NhongPlus" target="_blank" >
                <ActionIcon variant="transparent" color="gray" size="lg" radius="xl" classNames={{ root: style.icon }}>
                  <IconBrandGithubFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Anchor>

              <Anchor href="https://www.facebook.com/bao.long.ok/" target="_blank" >
                <ActionIcon variant="transparent" color="gray" size="lg" radius="xl" classNames={{ root: style.icon }}>
                  <IconBrandFacebookFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Anchor>

              <Anchor href="https://www.instagram.com/_blong2004_/" target="_blank" >
                <ActionIcon variant="transparent" color="gray" size="lg" radius="xl" classNames={{ root: style.icon }}>
                  <IconBrandInstagramFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Anchor>

            </Group>
            <Image src={Certificate} w={120} />
          </Group>
        </Container>
      </div>
    </>
  );
}

export default Footer;