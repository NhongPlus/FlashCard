import React, { useState } from 'react';
import {
  Button,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Container,
  Image,
  Flex,
  Grid
} from '@mantine/core';
import { Link, useNavigate } from "react-router-dom"; // Fixed import
import { useForm } from '@mantine/form';
import { IconLock, IconMail } from '@tabler/icons-react';
import classes from './Login.module.css';
import Back from '@/assets/images/back.svg'
import { login } from '@/services/User/authService';
export function Login() {

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
      password: (value) => (value.length < 6 ? 'Mật khẩu phải hơn 6 kí tự' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError(null);
    setLoading(true);

    try {
      await login(values.email, values.password);
      navigate("/dashboard"); // ✅ chuyển thẳng
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid bg={'#F6F7FB'}>
      <Grid px={60} pt={60}>
        <Grid.Col span={4}>
          <Title order={2} ta={'center'} mb={20}>Login</Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Địa chỉ email"
              leftSection={<IconMail size={20} />}
              placeholder="hello@gmail.com"
              size="md"
              radius="md"
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              leftSection={<IconLock size={20} />}
              mt="md"
              size="md"
              radius="md"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            {error && <Text c="red" mt="sm">{error}</Text>}
            <Button
              fullWidth
              mt="xl"
              size="md"
              radius="md"
              type="submit"
              loading={loading}
            >
              Đăng nhập
            </Button>

            <Link to="/register">
              <Text ta="right" mt="md">
                Chưa có tài khoản?{' '} Đăng ký ngay
              </Text>
            </Link>
          </form>
        </Grid.Col>
        <Grid.Col span={8}>
          <Flex justify={'end'}>
            <Image src={Back} className={classes.img} />
          </Flex>
        </Grid.Col>
      </Grid>
    </Container >
  );
}

export default Login;



