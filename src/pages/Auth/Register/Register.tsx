// src/pages/Auth/Register.tsx
import { Button, PasswordInput, TextInput, Title, Grid, Container, Image, Flex, Text, } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLock, IconMail } from "@tabler/icons-react";
import Back from '@/assets/images/back.svg'
import style from './Register.module.css'
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/services/authService";
import { useState } from "react";
export default function Register() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirm: ""
    },
    validate: {
      confirm: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
      password: (value) => (value.length < 6 ? 'Password phải hơn 6 kí tự' : null),
    },
  });
  const navigate = useNavigate();
  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)
    try {
      await register(values.email, values.password);
      navigate("/dashboard"); // ✅ chuyển thẳng
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container fluid bg={'#F6F7FB'}>
        <Grid px={60} pt={60}>
          <Grid.Col span={4}>
            <Title order={2} ta={'center'} mb={20}>Register</Title>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email address"
                leftSection={<IconMail size={20} />}
                placeholder="hello@gmail.com"
                size="md"
                radius="md"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size={20} />}
                mt="md"
                size="md"
                radius="md"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label="Password"
                placeholder="Confirm password"
                leftSection={<IconLock size={20} />}
                mt="md"
                size="md"
                radius="md"
                key={form.key('confirm')}
                {...form.getInputProps("confirm")}
              />
              <Button fullWidth mt="lg" type="submit" loading={loading}>Register</Button>
              <Link to="/login">
                <Text ta="right" mt="md">
                  Đã có tài khoản?{' '} Đăng nhập ngay
                </Text>
              </Link>
            </form>
          </Grid.Col>
          <Grid.Col span={8}>
            <Flex justify={'end'}>
              <Image src={Back} className={style.img} />
            </Flex>
          </Grid.Col>
        </Grid>
      </Container >
    </>
  );
}
