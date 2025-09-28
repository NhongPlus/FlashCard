import { Box, NumberInput, Text } from '@mantine/core';
import styles from './NumberInput.module.css';
import { useRef } from 'react';

export interface NumberInputProps {
  rightSection?: string;
  w?: string | number;
  label?: string;
  backgroundColor?: string;
  placeholder?: string;
  thousandSeparator?: boolean;
  value?: number | string;
  description?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (value: number | string) => void;
}

export const FormNumberInput = ({
  w,
  rightSection,
  label,
  placeholder,
  thousandSeparator,
  value,
  error,
  disabled,
  description,
  onChange,
  ...props
}: NumberInputProps) => {
  const isErrorInput = Boolean(error);
  const textRef = useRef<HTMLDivElement | null>(null);

  return (
    <Box style={w ? { width: w } : { flex: 1 }}>
      <NumberInput
        hideControls
        value={value}
        onChange={onChange}
        {...props}
        label={label}
        thousandSeparator={thousandSeparator ? ',' : ''}
        disabled={disabled}
        placeholder={placeholder}
        inputWrapperOrder={['label', 'input', 'description', 'error']}
        rightSection={
          rightSection ? (
            <Text ref={textRef} c={'#212121'} style={{ display: 'inline-block' }}>
              {rightSection}
            </Text>
          ) : null
        }
        rightSectionWidth={53} 
        classNames={{
          input: `${styles.NumberInput} ${isErrorInput ? styles.boderError : ''}`,
          description: styles.numberDescription,
          section: styles.sectionClass,
          label: styles.NumberInputLabel,
          error: styles.textError,
        }}
      />
      {!isErrorInput && description && (
        <Text size="sm" mt={4} className={styles.numberDescription} c={'#757575'}>
          {description}
        </Text>
      )}
      {isErrorInput && error && (
        <Text size="sm" mt={4} className={styles.textError}>
          {error}
        </Text>
      )}
    </Box>
  );
};
