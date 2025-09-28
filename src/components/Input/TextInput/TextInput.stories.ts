// eslint-disable-next-line storybook/no-renderer-packages
import { type Meta, type StoryObj } from '@storybook/react';
import { FormTextInput, type TextInputProps } from './TextInput';

const meta: Meta<TextInputProps> = {
  title: 'TextInput/LamCaiTextInput',  
  component: FormTextInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<TextInputProps>;

export const Greeđsdsn: Story = {
  args:{
    label: 'CIF',
    placeholder: 'nhập CIF'
  }
};
