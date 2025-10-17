import { Box, Textarea, Text } from '@mantine/core';
import styles from './TextArea.module.css'

export interface TextareaProps {
  label?: string;
  placeholder?: string;
  description?: string;
  w?: string | number;
  disabled?: boolean;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  h?: number;
  error?: string;
  filled: boolean;
  required: boolean;
}

export const FormTextarea = ({
  required,
  onChange,
  filled,
  label,
  placeholder,
  disabled,
  value,
  w,
  h,
  error,
  description,
}: TextareaProps) => {
  const isErrorInput = Boolean(error);

  return (
    <Box style={{ flex: 1 }}>
      <Textarea
        w={w}
        styles={{
          input: { height: h }, // đây mới là chỗ đúng để set chiều cao
        }} // chia tương đối, 1 dòng ~24px
        variant={filled ? 'filled' : 'default'}
        label={label}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
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
  );
};
