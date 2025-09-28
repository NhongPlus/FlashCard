import style from './QuotesCarousel.module.css'
import { Carousel } from '@mantine/carousel';
import { Box, Flex, Text } from '@mantine/core';

export interface QuotesCarouselProps {
    value: string;
    author: string;
    age?: number;
}
function QuotesCarousel({ value, author, age }: QuotesCarouselProps) {
    return (
        <>
            <Carousel.Slide >
                <Box className={style.box} >
                    <Flex direction={'column'} align={'center'}>
                        <Text className={style.text} >
                            {value}
                        </Text>
                        <Text c={'#A9B2C7'} className={style.author}>
                            - {author}{age ? ', ' + age + ' tuổi' : <></>}
                        </Text>
                    </Flex>
                </Box>
            </Carousel.Slide>
        </>
    );
}

export default QuotesCarousel;