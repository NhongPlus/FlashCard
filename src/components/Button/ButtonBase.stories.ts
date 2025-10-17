import { Meta, StoryObj } from '@storybook/react';
import { ButtonBase, ButtonBaseProps } from './ButtonBase';

const meta: Meta<ButtonBaseProps> = {
  title: 'ButtonBase/LamCaiButtonBase',  
  component: ButtonBase,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<ButtonBaseProps>;

export const Btn: Story = {
  args: {
    disabled: false,
    label: 'Xoá tìm kiếm',
    color: '#212121'
  },
};
