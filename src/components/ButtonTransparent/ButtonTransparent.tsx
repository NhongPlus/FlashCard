import {  type ReactNode } from 'react';
import {
  Button as MantineButton,
  Image,
} from '@mantine/core';
import styles from './ButtonTransparent.module.css';
import { Link } from 'react-router-dom';

export interface ButtonTransparentProps {
  label?: string;
  size?: string;
  disable?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  color?: string;
  to?: string;
}

export const ButtonTransparent = ({
  label,
  size,
  disable = false,
  leftIcon,
  rightIcon,
  onClick,
  ...props
}: ButtonTransparentProps) => {
  const renderIcon = (icon: ReactNode) => {
    let iconSize = 16;
    if (size === 'lg') {
      iconSize = 20;
    }
    if (typeof (icon) === 'string') {
      return <Image src={icon} />
    } else {
      return (
        <div style={{
          width: iconSize,
          height: iconSize
        }}>
        </div>
      );
    }
  };

  return (
    <MantineButton
      to={''} variant="transparent"
      radius="xl"
      size={size}
      fz={size}
      onClick={onClick}
      disabled={disable}
      classNames={{
        root: styles.rootClass, // tên là rootClass
      }}
      leftSection={renderIcon(leftIcon)}
      rightSection={renderIcon(rightIcon)}
      component={Link} // thêm dòng này
      {...props}    >
      {label}
    </MantineButton>
  );
};
