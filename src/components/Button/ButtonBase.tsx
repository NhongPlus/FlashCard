import {  type ReactNode } from 'react';
import {
  Button as MantineButton,
} from '@mantine/core';
import styles from './ButtonBase.module.css';

export interface ButtonBaseProps {
  label?: string;
  size?: string;
  disable?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  color?: string;
  to?: string;
  fullWidth: boolean
}

export const ButtonBase = ({
  label,
  size,
  disable = false,
  leftIcon,
  rightIcon,
  onClick,
  fullWidth,
  ...props
}: ButtonBaseProps) => {
  // const renderIcon = (icon: ReactNode) => {
  //   let iconSize = 16;
  //   if (size === 'lg') {
  //     iconSize = 20;
  //   }
  //   if (typeof (icon) === 'string') {
  //     return <Image src={icon} />
  //   } else {
  //     return (
  //       <div style={{
  //         width: iconSize,
  //         height: iconSize
  //       }}>
  //       </div>
  //     );
  //   }
  // };

  return (
    <MantineButton
      variant="filled"
      radius="xl"
      size={size}
      fz={size}
      onClick={onClick}
      disabled={disable}
      classNames={{
        root: styles.rootClass,  // tên là rootClass
      }}
      leftSection={(leftIcon)}
      rightSection={(rightIcon)}
      fullWidth={fullWidth}
      {...props}
    >
      {label}
    </MantineButton>
  );
};
