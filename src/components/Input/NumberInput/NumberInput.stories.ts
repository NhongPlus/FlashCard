import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormNumberInput, type NumberInputProps } from './NumberInput';

const meta: Meta<NumberInputProps> = {
  title: 'NumberInput/LamCaiNumberInput',  
  component: FormNumberInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<NumberInputProps>;

export const Greeđsdsn: Story = {
  args:{

  }
};
