import { IconBrandFacebookFilled, IconLogout, IconSettings } from '@tabler/icons-react';
import { Avatar, Burger, Center, Container, Group, Menu, UnstyledButton, Text, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderMenu.module.css';
import { Link } from 'react-router-dom';
import useAuth from '@/utils/hooks/useAuth';
import useUserProfile from '@/utils/hooks/useUserProfile';
import { logout } from '@/services/User/authService';
import { notifications } from '@mantine/notifications';
import SearchStudySet from '../Search/SearchStudySet';

const NAVIGATION_LINKS = {
  authenticated: [
    {
      label: 'Add',
      links: [
        { link: '/folder', label: 'Folder' },
        { link: '/add-set', label: 'Add Card' },
      ],
    }
  ],
  guest: [{ label: 'Login', link: '/login' }]
};

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const { user, isAuthenticated } = useAuth();
  const currentLinks = isAuthenticated ? NAVIGATION_LINKS.authenticated : NAVIGATION_LINKS.guest;
  const { profile } = useUserProfile();

  const renderNavItems = () => {
    return currentLinks.map((link) => {
      if  ('links' in link) {
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

  // ✅ FIX #1: Handle logout async properly
  const handleLogout = async () => {
    try {
      await logout();
      notifications.show({
        title: 'Thành công',
        message: 'Đã đăng xuất',
        color: 'green'
      });
    } catch (error) {
      console.error('Logout error:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra khi đăng xuất',
        color: 'red'
      });
    }
  };

  const renderUserMenu = () => {
    if (!isAuthenticated || !user) return null;

    return (
      <Menu width={260} transitionProps={{ transition: 'pop-top-right' }} withinPortal>
        <Menu.Target>
          <UnstyledButton>
            {/* ✅ FIX #2: Handle undefined imageActive & photoURL */}
            <Avatar
              src={profile?.imageActive || user.photoURL || undefined}
              radius="xl"
              size={40}
            />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Group px={10} py={20}>
            {/* ✅ FIX #2: Handle undefined imageActive & photoURL */}
            <Avatar 
              src={profile?.imageActive || user.photoURL || undefined} 
              w={50} 
              h={50} 
            />
            <Flex direction="column">
              {/* ✅ FIX #3: Handle undefined displayName & email */}
              <Text fw={500}>{profile?.displayName || user.displayName || 'New user'}</Text>
              <Text size="sm" c="#586380">{profile?.email || user.email || ''}</Text>
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
          {/* ✅ FIX #1 & #4: Handle async logout + remove onClick warning */}
          <Menu.Item
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={handleLogout}
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
          {/* ✅ FIX #5: Use Link component correctly */}
          <Link to={isAuthenticated ? "/dashboard" : "/about"} style={{ display: 'flex', alignItems: 'center' }}>
            <IconBrandFacebookFilled size={28} />
          </Link>
          {/* Search enginer */}
          <SearchStudySet />
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