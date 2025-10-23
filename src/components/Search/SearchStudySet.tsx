// src/components/Search/SearchStudySet.tsx - FIXED WITH FULL FLOW

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

  // ✅ Giới hạn chỉ hiển thị 5 kết quả đầu tiên
  const limitedStudySets = studySets.slice(0, 5);

  // ✅ Render options (max 5 items)
  const options = limitedStudySets.map((studySet) => (
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

  // ✅ Handle: Navigate đến trang explore với query
  const goToExploreWithSearch = () => {
    if (value.trim()) {
      navigate(`/explore?q=${encodeURIComponent(value.trim())}`);
      combobox.closeDropdown();
    }
  };

  // ✅ Handle: Khi user ấn Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      goToExploreWithSearch();
    }
  };

  return (
    <Combobox
      onOptionSubmit={(studySetId) => {
        // ✅ CASE 1: Click vào 1 study set → Navigate đến /learning
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
            // ✅ Delay để button "Tìm tất cả" có thể click được
            setTimeout(() => {
              combobox.closeDropdown();
            }, 200);
          }}
          onKeyDown={handleKeyDown} // ✅ CASE 2: Ấn Enter
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <ScrollArea classNames={{ viewport: style.viewport }}>
          <Combobox.Options>
            {loading && value ? (
              <Combobox.Empty>
                <Group justify="center" p="md">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">Đang tìm kiếm...</Text>
                </Group>
              </Combobox.Empty>
            ) : options.length === 0 && value ? (
              <Combobox.Empty>
                <Text size="sm" c="dimmed" ta="center" p="md">
                  Không tìm thấy học phần nào với từ khóa "{value}"
                </Text>
              </Combobox.Empty>
            ) : options.length === 0 ? (
              <Combobox.Empty>
                <Text size="sm" c="dimmed" ta="center" p="md">
                  Nhập từ khóa để tìm kiếm học phần công khai
                </Text>
              </Combobox.Empty>
            ) : (
              <>
                {options}
                
                {/* ✅ CASE 3: Button "Tìm tất cả" ở dưới cùng */}
                {value && studySets.length > 0 && (
                  <UnstyledButton
                    onClick={goToExploreWithSearch}
                    className={style.viewAllButton}
                  >
                    <Text size="sm" c="blue" fw={600} ta="center" py="xs">
                      Xem tất cả kết quả cho "{value}"
                    </Text>
                  </UnstyledButton>
                )}
              </>
            )}
          </Combobox.Options>
        </ScrollArea>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default SearchStudySet;