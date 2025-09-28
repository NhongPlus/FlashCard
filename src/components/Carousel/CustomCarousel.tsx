import style from './CustomCarousel.module.css'
import { Carousel } from '@mantine/carousel';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import CardCarousel from './ChildCarousel/CardCarousel/CardCarousel';
import QuotesCarousel from './ChildCarousel/QuotesCarousel/QuotesCarousel';


export interface CustomCarouselProps {
    play?: boolean;
    timeChangeCard?: number;
    children: React.ReactNode;
    slideSize: number,
    slideGap: string,
    drag?: boolean,
    controls?: boolean,
}
function CustomCarousel({
    play,
    timeChangeCard = 1500,
    children,
    slideSize,
    slideGap,
    drag,
    controls ,
}: CustomCarouselProps) {
    const autoplay = useRef(Autoplay({ delay: timeChangeCard }));
    const handleMouseEnter = () => play && autoplay.current.stop();
    const handleMouseLeave = () => play && autoplay.current.play();
    return (
        <>
            <Carousel
                slideSize={`${slideSize}%`}
                slideGap={slideGap}
                withControls={controls}
                controlSize={70}
                nextControlIcon={<IconArrowRight size={36} />}
                previousControlIcon={<IconArrowLeft size={36} />}
                plugins={play ? [autoplay.current] : []}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                emblaOptions={{
                    loop: true,
                    dragFree: drag,
                    align: 'start'
                }}
                classNames={{
                    slide: style.rootSlide,
                    control: style.rootControls
                }}
            >
                {children}
            </Carousel>
        </>
    );
}

CustomCarousel.CardCarousel = CardCarousel;
CustomCarousel.QuotesCarousel = QuotesCarousel;


export default CustomCarousel;