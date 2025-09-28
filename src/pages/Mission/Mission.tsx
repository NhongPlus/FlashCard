import CustomCarousel from "@/components/Carousel/CustomCarousel";
import Footer from "@/components/Footer/Footer";
import style from './Mission.module.css'
import { Container, Grid, Space, Title, Text, Image, Group } from "@mantine/core";
const data = [
  {
    value: 'TÔI YÊU NHONGPLUS! Tôi giới thiệu ứng dụng này cho mọi người ở Anh. Tôi đã dùng NhongPlus để ôn tập cho các kỳ thi của mình và nó thật tuyệt vời. Đây quả là một cách học đầy tương tác, không khiến tôi thấy nhàm chán.',
    author: 'Long Plus',
    age: 10
  },
  {
    value: 'Tôi thường trì hoãn khi phải học bài để kiểm tra, thậm chí còn chẳng học. Việc sử dụng NhongPlus đã giúp tôi thực sự muốn học, bởi nó đã chứng minh hiệu quả khi giúp tôi chuẩn bị cho bài kiểm tra.',
    author: 'Nhong Plus',
    age: 90
  },
  {
    value: 'NhongPlus đã thay đổi cách tôi học! Giao diện thân thiện và các bài tập thú vị khiến tôi hào hứng ôn bài mỗi ngày.',
    author: 'Minh Star',
    age: 15
  },
  {
    value: 'Nhờ NhongPlus, tôi đã cải thiện điểm số đáng kể. Các tính năng thông minh của ứng dụng giúp tôi ghi nhớ kiến thức lâu hơn!',
    author: 'Hà Moon',
    age: 22
  }
]
function Mission() {
  return (
    <>
      <Container size="lg" className={style.wrapper} >
        <Grid mt={100}>
          <Grid.Col span={5}>
            <Title className={style.title}>
              About me
            </Title>
            <Space h="xl" />
            <Text className={style.text}>
              I’m Nguyen Ngoc Bao Long, I started learning to code in my first year of university.
              I have a passion for front-end development and began with HTML.
              Currently, I am working with ReactJS.
              I created this FlashCard App as both a way to sharpen my skills
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
              <Title className={style.title}>
                Chọn cách học mà bạn muốn
              </Title>
              <Text className={style.text} style={{ marginBottom: 30 }}>
                I believe effective learning comes from interaction and engagement. That’s why I focus on building features that make studying more approachable, enjoyable, and impactful.
              </Text>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
      <CustomCarousel play controls={false} slideSize={100} slideGap={'xl'} drag={false} timeChangeCard={5000}>
        {data.map((item) => {
          return (
            <CustomCarousel.QuotesCarousel value={item.value} author={item.author} age={item.age} />
          )
        })}
      </CustomCarousel>
      <Footer />
    </>
  );
}

export default Mission;