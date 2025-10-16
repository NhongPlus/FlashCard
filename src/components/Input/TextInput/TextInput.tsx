import { Box, TextInput, Text } from '@mantine/core';
import styles from './TextInput.module.css'

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  description?: string;
  w?: string | number;
  disabled?: boolean;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  h?: number;
  error?: string;
  filled: boolean;
}
export const FormTextInput = ({ onChange, filled, label, placeholder, disabled, value, w, h, error, description, }: TextInputProps) => {
  const isErrorInput = Boolean(error)
  return (
    <Box style={{ flex: 1 }}>
      <TextInput
        w={w}
        variant={filled == true ? "filled" : 'default'}
        style={w ? { width: w } : { flex: 1 }}
        h={h}
        label={label}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        classNames={{
          label: styles.textInputLabel,
          input: `${styles.textInput} ${isErrorInput ? styles.boderError : ''}`,
          error: styles.textError,
        }}
      />
      {!isErrorInput && description && (
        <Text size="sm" mt={4} className={styles.textDescription}>
          {description}
        </Text>
      )}
      {isErrorInput && error && (
        <Text size="sm" mt={4} className={styles.textError}>
          {error}
        </Text>
      )}
    </Box>
  )
};
