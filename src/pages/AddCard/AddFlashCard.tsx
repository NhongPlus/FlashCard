import { Box, Button, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

function AddFlashCard() {
    const [arrCard, setArrCard] = useState([
        { id: uuidv4(), english: "Apple", vietnamese: "Quả táo" },
        { id: uuidv4(), english: "Book", vietnamese: "Sách" },
        { id: uuidv4(), english: "House", vietnamese: "Ngôi nhà" },
        { id: uuidv4(), english: "Tree", vietnamese: "Cây cối" },
        { id: uuidv4(), english: "Sun", vietnamese: "Mặt trời" }
    ])
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            english: '',
            vietnamese: '',
        },

        validate: {
            english: (value) => (value.length === 0 ? 'Không để rỗng' : null),
            vietnamese: (value) => (value.length === 0 ? 'Không để rỗng' : null),
        },
    });
    function handleValue(value: { english: string; vietnamese: string; }) {
        setArrCard([...arrCard, { id: uuidv4(), english: value.english, vietnamese: value.vietnamese }])
    }

    return (
        <>
            <Box className=''>
                <form onSubmit={form.onSubmit((value) => handleValue(value))}>
                    <Input placeholder="Eng"
                        key={form.key('english')}
                        {...form.getInputProps('english')}
                    />
                    <Input placeholder="Vie"
                        key={form.key('vietnamese')}
                        {...form.getInputProps('vietnamese')}
                    />
                    <Button type='submit'>Submit</Button>
                </form>
            </Box>
        </>
    );
}

export default AddFlashCard;

function uuidv4() {
    throw new Error("Function not implemented.");
}
