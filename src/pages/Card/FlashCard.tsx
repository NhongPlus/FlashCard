import { Card, Text } from "@mantine/core";
interface FlashCardProps {
    cards: { id: string; english: string; vietnamese: string; }[],
    show: number,
    setFlippedIds: React.Dispatch<React.SetStateAction<string[]>>
    flippedIds : string[]
}
function FlashCard({ cards, show, setFlippedIds , flippedIds }: FlashCardProps,) {

    function handleFlip(id: string) {
        if (flippedIds.includes(id)) {
            setFlippedIds(flippedIds.filter((flippedId) => flippedId !== id));
        } else {
            setFlippedIds([...flippedIds, id]);
        }
    }
    return (
        <>
            <Card
                shadow="sm"
                padding="xl"
                key={cards[show].id}
                onClick={() => handleFlip(cards[show].id)}
                className=' md:shrink-0 py-4'
            >
                <Text fw={500} size="lg" ta={'center'} style={{ userSelect: 'none', cursor: 'pointer' }}>
                    {flippedIds.includes(cards[show].id) ? cards[show].vietnamese : cards[show].english}
                </Text>
            </Card>
        </>
    );
}

export default FlashCard;