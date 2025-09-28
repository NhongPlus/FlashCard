import { Box, Flex, Text, Image } from '@mantine/core';
import style from './CardCarousel.module.css'
import { Carousel } from '@mantine/carousel';

export interface CardCarouselProps {
    value: string,
    color: string;
    image: string;
}
function CardCarousel({ value, color, image }: CardCarouselProps) {
    return (
        <>
            <Carousel.Slide >
                <Box w={310} bg={color} className={style.box} >
                    <Flex direction={'column'} align={'center'} justify={'center'}>
                        <Text
                            py={30}
                            className={style.text}
                            c={color == '#423ED8' ? 'white' : 'inherit'}
                        >
                            {value}
                        </Text>
                        <Image src={image} className={style.image} />
                    </Flex>
                </Box>
            </Carousel.Slide>
        </>
    );
}

export default CardCarousel;