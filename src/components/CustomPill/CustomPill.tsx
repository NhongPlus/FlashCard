import {
  Pill,
} from '@mantine/core';
import styles from './CustomPill.module.css';

export interface CustomPillProps {
  label: string;
  disable?: boolean;
}

export const CustomPill = ({
  label,
  disable,
}: CustomPillProps) => {
  

  return (
    <Pill classNames={{ root : styles.rootClass}} disabled={disable}>
      {label}
    </Pill>
  );
};
