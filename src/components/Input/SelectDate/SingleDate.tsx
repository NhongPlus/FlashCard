import { Box, Text, Image, Combobox, InputBase, useCombobox } from '@mantine/core';
import styles from './SingleDate.module.css';
import '@mantine/dates/styles.css';
import { DatePicker, type DateValue } from '@mantine/dates';
import Calendar from '@/assets/images/icon/Calendar.svg';
import YellowArrow from '@/assets/images/icon/YellowArrow.svg';
import { useUncontrolled } from '@mantine/hooks';

export interface SingleDateProps {
  placeholder?: string;
  label?: string;
  w?: number;
  value?: DateValue;
  error?: string;
  disabled?: boolean;
  defaultValue?: DateValue;
  onChange?: (value: DateValue) => void;
}

export const SingleDate = ({ value, onChange, w, label, defaultValue, placeholder , disabled }: SingleDateProps) => {
  const [_value, handleChange] = useUncontrolled<DateValue>({
    value,
    defaultValue,
    finalValue: null,
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
  // console.log(String(_value?.getFullYear()).slice(-2));
  const displayText = _value ? `${_value.toLocaleString()}` : placeholder;
  return (
    <>
      <Box style={{ flex: 1 }}>
        <Text className={styles.textInputLabel}>{label}</Text>
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={() => combobox.closeDropdown()}
          position="bottom-end"
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              disabled={disabled}
              rightSection={<Image src={Calendar} w={24}/>}
              rightSectionPointerEvents="none"
              onClick={() => combobox.toggleDropdown()}
              w={w}
              classNames={{
                label: styles.textInputLabel,
                section: styles.sectionClass,
                input: `${styles.textInput} ${_value ? styles.filled : styles.placeholder}`,
              }}
            >
              {displayText}
            </InputBase>
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
              allowDeselect
              value={_value}
              w={296}
              onChange={handleChange}
              previousIcon={<Image src={YellowArrow} w={11.2} style={{ transform: "rotate(180deg)" }} />}
              nextIcon={<Image src={YellowArrow} w={11.2} />}
              firstDayOfWeek={0}
              monthLabelFormat="MMMM - YYYY"
              classNames={{
                weekday: styles.weekday,
                calendarHeader: styles.calendarHeader,
                levelsGroup: styles.levelsGroup,
                day: styles.day,
                monthCell: styles.monthCell
              }}
            />
          </Combobox.Dropdown>
        </Combobox>
      </Box>
    </>
  );
};
