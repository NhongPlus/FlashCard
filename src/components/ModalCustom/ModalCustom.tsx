import { Modal, Text, Stack, Image } from "@mantine/core";
import { ButtonBase } from "../Button/ButtonBase";
import style from './ModalCustom.module.css'
interface ModalCustomProps {
  text: string;
  onClick: () => void; // Bỏ optional, bắt buộc phải có
  textButton: string;
  opened: boolean;
  image: string;

}

function ModalCustom({
  text,
  onClick,
  textButton,
  opened,
  image,
}: ModalCustomProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => { }}
      size={'xl'}
      withCloseButton={false} // Ẩn nút X
      centered={true}
      closeOnEscape={false} // Không đóng khi nhấn ESC
      closeOnClickOutside={false} // Không đóng khi click ngoài
      overlayProps={{
        backgroundOpacity: 0.9, // Tăng opacity để nhấn mạnh modal
        blur: 3,
      }}
      classNames={{
        content: style.contentClass
      }}
    >
      <Stack gap="lg" align="center">
        <Text size="xl" ta="center" fw={500} style={{ whiteSpace: 'pre-line', lineHeight: 2.2 }}>
          {text}
        </Text>
        <Image src={image} className={style.imageClass} />
        <ButtonBase
          onClick={onClick}
          label={textButton}
          size="sm"
          fullWidth={true}
        />
      </Stack>
    </Modal>
  );
}

export default ModalCustom;