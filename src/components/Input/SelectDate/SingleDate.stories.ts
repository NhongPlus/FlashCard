import type { Meta, StoryObj } from '@storybook/react';
import { SingleDate, type SingleDateProps } from './SingleDate';

const meta: Meta<SingleDateProps> = {
  title: 'SingleDate',
  component: SingleDate,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<SingleDateProps>;

export const Singledate: Story = {
  args: {
    
  },
};
