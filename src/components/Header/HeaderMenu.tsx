import { IconBrandFacebookFilled, IconLogout, IconSettings } from '@tabler/icons-react';
import { Avatar, Burger, Center, Container, Group, Menu, UnstyledButton, Text, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderMenu.module.css';
import { Link } from 'react-router-dom';
import useAuth from '@/utils/hooks/useAuth';
import { getAuth } from 'firebase/auth';
import useUserProfile from '@/utils/hooks/useUserProfile';
import { logout } from '@/services/User/authService';

const NAVIGATION_LINKS = {
  authenticated: [
    {
      label: 'Add',
      links: [
        { link: '/folder', label: 'Folder' },
        { link: '/add', label: 'Add Card' },
      ],
    }
  ],
  guest: [{ label: 'Login', link: '/login' }]
};

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const { user, isAuthenticated } = useAuth();
  const currentLinks = isAuthenticated ? NAVIGATION_LINKS.authenticated : NAVIGATION_LINKS.guest;
  const { profile, loading, error } = useUserProfile();

  const renderNavItems = () => {
    return currentLinks.map((link) => {
      if (link.links) {
        return (
          <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
            <Menu.Target>
              <div className={classes.link}>
                <Center>
                  <span className={classes.linkLabel}>{link.label}</span>
                </Center>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              {link.links.map((item) => (
                <Menu.Item key={item.link} component={Link} to={item.link}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        );
      }

      return (
        <Link key={link.label} to={link.link!} className={classes.link}>
          <Center>
            <span className={classes.linkLabel}>{link.label}</span>
          </Center>
        </Link>
      );
    });
  };

  const renderUserMenu = () => {
    if (!isAuthenticated || !user) return null;

    return (
      <Menu width={260} transitionProps={{ transition: 'pop-top-right' }} withinPortal>
        <Menu.Target>
          <UnstyledButton>
            <Avatar
              src={profile?.imageActive || user.photoURL}
              radius="xl"
              size={40}
            />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Group px={10} py={20}>
            <Avatar src={profile?.imageActive || user.photoURL} w={50} h={50} />
            <Flex direction="column">
              <Text>{profile?.displayName || 'New user'}</Text>
              <Text c="#586380">{profile?.email}</Text>
            </Flex>
          </Group>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconSettings size={16} stroke={1.5} />}
            component={Link}
            to="/settings"
          >
            Account settings
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={(async () => logout())}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Link to={isAuthenticated ? "/dashboard" : "/about"}>
            <IconBrandFacebookFilled size={28} />
          </Link>

          <Group gap={5} visibleFrom="sm">
            {renderNavItems()}
            {renderUserMenu()}
          </Group>

          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}