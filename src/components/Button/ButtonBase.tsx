import { Button, Image } from '@mantine/core';
import type { ReactNode } from 'react';
import styles from './ButtonBase.module.css';

export interface ButtonBaseProps {
  label: string;
  disabled?: boolean;
  color?: string;
  icon?: ReactNode;
  textColor?: string;
  size?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'filled' | 'outline';
  fullWidth?: boolean;
  onClick?: () => void;
}

export const ButtonBase = ({
  label,
  disabled = false,
  color = '#4255FF',
  icon,
  textColor = '#fff',
  size = 'md',
  type = 'button',
  variant = 'filled',
  fullWidth = false,
  onClick,
}: ButtonBaseProps) => {
  const renderIcon = (icon: ReactNode) => {
    if (typeof icon === 'string') return <Image src={icon} />;
    return icon ?? null;
  };

  const buttonStyles = {
    backgroundColor: variant === 'filled' ? color : 'transparent',
    color: variant === 'filled' ? textColor : color,
    borderColor: variant === 'filled' ? 'transparent' : color,
  };

  return (
    <Button
      disabled={disabled}
      variant={variant}
      radius="xl"
      size={size}
      type={type}
      leftSection={renderIcon(icon)}
      style={buttonStyles}
      fullWidth={fullWidth}
      fw={500}
      classNames={{
        root: styles.ButtonBase,
        section: styles.sectionButton,
        label: styles.labelButton,
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
