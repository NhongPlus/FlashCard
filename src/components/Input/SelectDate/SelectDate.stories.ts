// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { SelectDate, type SelectDateProps } from './SelectDate';

const meta: Meta<SelectDateProps> = {
  title: 'SelectDate',
  component: SelectDate,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<SelectDateProps>;

export const huhPickdate: Story = {
  args: {
    
  },
};
