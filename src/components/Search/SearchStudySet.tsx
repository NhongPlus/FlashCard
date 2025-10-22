// src/components/SearchStudySet/SearchStudySet.tsx - FIXED

import { CloseButton, Combobox, Highlight, ScrollArea, TextInput, useCombobox, Loader, Text, Group, Badge, UnstyledButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './SearchStudySet.module.css';
import { IconSearch, IconFileDescription } from '@tabler/icons-react';
import { usePublicStudySets } from '@/utils/hooks/usePublicStudySets';

function SearchStudySet() {
  const navigate = useNavigate();
  const { studySets, loading, search } = usePublicStudySets();
  const [value, setValue] = useState('');

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  // ✅ Auto search với debounce 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      search(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, search]);

  // ✅ Render options từ studySets
  const options = studySets.map((studySet) => (
    <Combobox.Option
      value={studySet.id}
      key={studySet.id}
      classNames={{ option: style.optionCombobox }}
    >
      <Group gap="xs" wrap="nowrap">
        <IconFileDescription size={16} color="#4dabf7" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Highlight highlight={value} size="sm" lineClamp={1}>
            {studySet.title}
          </Highlight>
          {studySet.description && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {studySet.description}
            </Text>
          )}
        </div>
        <Badge size="xs" variant="light" color="blue">
          {studySet.cardCount} thẻ
        </Badge>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(studySetId) => {
        // ✅ Navigate đến trang learning khi chọn
        navigate(`/learning/${studySetId}`);
        setValue('');
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          leftSection={loading ? <Loader size={16} /> : <IconSearch size={16} />}
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setValue('')}
              style={{ display: value ? undefined : 'none' }}
            />
          }
          placeholder="Tìm kiếm học phần công khai..."
          value={value}
          classNames={{
            input: style.inputCombobox,
            wrapper: style.wrapperCombobox,
            section: style.sectionCombobox,
          }}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.updateSelectedOptionIndex();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            setTimeout(() => {
              combobox.closeDropdown();
            }, 100);
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <ScrollArea classNames={{ viewport: style.view }}>
          <Combobox.Options>
            {loading && value ? (
              <Combobox.Empty>
                <Group justify="center">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">Đang tìm kiếm...</Text>
                </Group>
              </Combobox.Empty>
            ) : options.length === 0 && value ? (
              <Combobox.Empty>
                <Text size="sm" c="dimmed" ta="center">
                  Không tìm thấy học phần nào với từ khóa "{value}"
                </Text>
              </Combobox.Empty>
            ) : options.length === 0 ? (
              <Combobox.Empty>
                <Text size="sm" c="dimmed" ta="center">
                  Nhập từ khóa để tìm kiếm học phần
                </Text>
              </Combobox.Empty>
            ) : (
              options
            )}

            {/* Nút này sẽ chỉ hiển thị khi `value` không phải là chuỗi rỗng */}
            {value && (
              <UnstyledButton size="sx" c="dimmed" fw={600} m={5}>
                Xem tất cả kết quả 
              </UnstyledButton>
            )}
          </Combobox.Options>
        </ScrollArea>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default SearchStudySet;