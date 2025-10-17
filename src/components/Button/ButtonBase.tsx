import { type ReactNode, type ElementType } from 'react';
import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from '@mantine/core';
import styles from './ButtonBase.module.css';

interface ButtonBaseProps extends Omit<MantineButtonProps, 'children'> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  component?: ElementType;
  to?: string;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function ButtonBase({
  label,
  size = 'md',
  leftIcon,
  rightIcon,
  disabled = false,
  onClick,
  fullWidth = false,
  type = 'button',
  component,
  to,
  ...rest
}: ButtonBaseProps) {
  return (
    <MantineButton
      component={component as React.ElementType<unknown>}
      to={to}
      type={type}
      variant="filled"
      radius="xl"
      size={size}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      leftSection={leftIcon}
      rightSection={rightIcon}
      classNames={{ root: styles.rootClass }}
      {...rest}
    >
      {label}
    </MantineButton>
  );
}
