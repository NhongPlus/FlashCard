// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { CustomPill } from './CustomPill';
import type { CustomPillProps } from './CustomPill';


const meta: Meta<CustomPillProps> = {
  title: 'Pill/CustomPill',  
  component: CustomPill,       
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disable: { control: 'boolean' }, 
  },
  args: {
    disable: false,
  },
};

export default meta;
type Story = StoryObj<CustomPillProps>;

export const Large: Story = {
  args: {
    label: 'Button',
    disable: false,
  },
};

export const Medium: Story = {
  args: {
    label: 'Button',
    disable: false,
  },
};
export const Small: Story = {
  args: {
    label: 'Button',
    disable: false,
  },
};
export const SuperSmall: Story = {
  args: {
    label: 'Label',
    disable: false,
  },
};
