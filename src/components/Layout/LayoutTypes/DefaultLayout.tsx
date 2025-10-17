import {
  Container, Title, Text, Group, Space, Grid, Flex, Image,
  BackgroundImage,
  Button,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './DefaultLayout.module.css';
import { ButtonBase } from '@/components/Button/ButtonBase';
import { CustomPill } from '@/components/CustomPill/CustomPill';
import Background from '@/assets/images/background/background.jpg'
import CustomCarousel from '@/components/Carousel/CustomCarousel';
import Footer from '@/components/Footer/Footer';
import Monkey from '@/assets/images/animal/sadMonkey.jpg'
import Cat from '@/assets/images/animal/sadCat.jpg'
import CatX from '@/assets/images/animal/blCat.jpg'
import blackCow from '@/assets/images/animal/blackCow.jpg'
import blackRabit from '@/assets/images/animal/blackRabit.jpg'


const data = [
  { value: 'Học', image: Monkey, color: '#423ED8' },
  { value: 'Lời giải chuyên gia', image: Cat, color: '#FFCD1F' },
  { value: 'Thẻ ghi nhớ', image: CatX, color: '#FDD2CA' },
  { value: 'Ghép thẻ', image: blackCow, color: '#98F1D1' },
  { value: 'Kiểm tra', image: blackRabit, color: '#98E3FF' },
]

function DefaultLayout() {
  return (
    <>
      <BackgroundImage src={Background} classNames={{ root: classes.rootClass }}>
        <Container size="lg" className={classes.wrapper}>
          <Flex justify='center' direction={'column'}>
            <Flex direction={'column'} align={'center'} gap={30}>
              <CustomPill label={'🧑‍🎓 Learn with me'} />
              <Title className={classes.title} ta={'center'}>
                Welcome to FlashCard App
              </Title>
            </Flex>
            <Text c="white" size="lg" ta="center">
              Create and study flashcards to improve your learning experience.
              <br />
              Join our community to access all features.
            </Text>
            <Group justify="center" mt="xl">
              <Button
                component={Link}
                to="/login"
                size="xl"
                color="#4255FF"
                radius="xl"
                variant="filled"
              >
                Bắt đầu
              </Button>
            </Group>
          </Flex>
        </Container>
      </BackgroundImage>

      <CustomCarousel play slideSize={26} slideGap={'xl'}>
        {data.map((item) => {
          return (
            <CustomCarousel.CardCarousel value={item.value} image={item.image} color={item.color} />
          )
        })}
      </CustomCarousel>

      <Container size="lg" className={classes.wrapper} >
        {/* 1 */}
        <Grid mt={100}>
          <Grid.Col span={5}>
            <Title className={classes.title}>
              Mọi lớp học, mọi bài thi, một ứng dụng học tập tối ưu
            </Title>
            <Space h="xl" />
            <Text className={classes.text}>
              Tạo thẻ ghi nhớ của riêng bạn hoặc tìm học phần do giáo viên, học sinh và chuyên gia tạo nên. Học mọi lúc, mọi nơi với ứng dụng miễn phí của chúng tôi.
            </Text>
          </Grid.Col>
          <Grid.Col span={1}></Grid.Col>
          <Grid.Col span='auto'>
            <Image
              radius="md"
              src="https://cdn.pixabay.com/photo/2024/11/21/16/18/ai-generated-9214143_1280.jpg"
            />
          </Grid.Col>
        </Grid>

        {/* 2 */}
        <Grid mt={100}>
          <Grid.Col span='auto'>
            <Image
              radius="md"
              src="https://cdn.pixabay.com/photo/2019/02/06/07/38/women-3978565_1280.jpg"
            />
          </Grid.Col>
          <Grid.Col span={1}></Grid.Col>
          <Grid.Col span={5}>
            <Group gap={'xl'}>
              <Title className={classes.title}>
                Chọn cách học mà bạn muốn
              </Title>
              <Text className={classes.text} style={{ marginBottom: 30 }}>
                Biến thẻ ghi nhớ thành câu hỏi trắc nghiệm và nhiều nội dung khác với chế độ Học. Củng cố kiến thức của bạn bằng các trò chơi học tập như Ghép thẻ.
              </Text>
              <ButtonBase component={Link} to="/login" size='xl' label='Bắt đầu' color='#4255FF' />
            </Group>
          </Grid.Col>
        </Grid>

        {/* 3 */}
        <Grid mt={100}>
          <Grid.Col span={5}>
            <Group gap={'lg'}>
              <Title className={classes.title}>
                Chuẩn bị ôn thi cho bất kỳ môn học nào
              </Title>
              <Text className={classes.text}>
                Ghi nhớ mọi thứ với các bài kiểm tra thử và phiên học được cá nhân hóa. 98% học sinh cho biết Quizlet đã giúp họ hiểu bài hơn.
              </Text>
              <ButtonBase component={Link} to="/login" size='xl' label='Bắt đầu' color='#4255FF' />
            </Group>
          </Grid.Col>
          <Grid.Col span={1}></Grid.Col>
          <Grid.Col span='auto'>
            <Image
              radius="md"
              src="https://cdn.pixabay.com/photo/2022/01/22/16/54/book-6957870_1280.jpg"
            />
          </Grid.Col>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}

export default DefaultLayout;