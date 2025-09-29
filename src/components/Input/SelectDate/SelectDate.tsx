import { Box, Text, Image, Combobox, InputBase, useCombobox } from '@mantine/core';
import styles from './SelectDate.module.css';
import '@mantine/dates/styles.css';
import { useState } from 'react';
import { DatePicker, type DatesRangeValue } from '@mantine/dates';
import Calendar from '@/assets/images/icon/Calendar.svg'
import { useUncontrolled } from '@mantine/hooks';

export interface SelectDateProps {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  w?: number;
  value?: DatesRangeValue;
  error?: string;
  defaultValue?: DatesRangeValue;
  onChange?: (value: DatesRangeValue) => void;
}

export const SelectDate = ({ value, onChange, w, label, error, defaultValue, placeholder , disabled }: SelectDateProps) => {
  const [_value, handleChange] = useUncontrolled<DatesRangeValue>({
    value,
    defaultValue,
    finalValue: [null, null],
    onChange,
  });
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
    },
    onDropdownOpen: () => {
      combobox.focusTarget();
    },
  });
  const handleDateChange = (newValue: DatesRangeValue) => {
    handleChange(newValue);
    if (newValue[0] && newValue[1]) {
      combobox.closeDropdown();
    }
  };
  const displayText =
    _value && _value[0] && _value[1]
      ? `${_value[0].toLocaleString()} - ${_value[1].toLocaleString()}`
      : placeholder;

  const isErrorInput = Boolean(error)

  return (
    <Box style={{ flex: 1 }}>
      <Text className={styles.textInputLabel}>{label}</Text>
      <Combobox
        store={combobox}
        withinPortal={false}
        onOptionSubmit={() => combobox.closeDropdown()}
        position="bottom-start"
      >
        <Combobox.Target>
          <Box>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<Image src={Calendar} />}
              rightSectionPointerEvents="none"
              onClick={() => combobox.toggleDropdown()}
              w={w}
              disabled={disabled}
              classNames={{
                label: styles.textInputLabel,
                section: styles.sectionClass,
                input: `${styles.textInput} ${_value && _value[0] && _value[1]
                  ? styles.filled
                  : styles.placeholder
                  } ${isErrorInput ? styles.error : null}`,
              }}
            >
              {displayText}
            </InputBase>
            {isErrorInput && error && (
              <Text size="sm" mt={4} className={styles.textError} component='p'>
                {error}
              </Text>
            )}
          </Box>
        </Combobox.Target>

        <Combobox.Dropdown
          style={{
            boxShadow: '0px 2px 10px 0px #00000033',
            border: 0,
            padding: 0,
            borderRadius: 12,
          }}
          className={styles.dropdown}
        >
          <DatePicker
            type="range"
            value={_value}
            onChange={handleDateChange}
            p={8}
            data-active={_value && _value[0] && _value[1] ? true : undefined}
            firstDayOfWeek={0}
            monthLabelFormat="MMMM - YYYY"
            classNames={{
              monthRow: styles.date,
              monthCell: `${styles.button} ${_value && _value[0] && _value[1] ? styles.active : ''}`,
              day: styles.day,
              levelsGroup: styles.levelsGroup,
              weekday: styles.weekday,
            }}
          />
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
};
