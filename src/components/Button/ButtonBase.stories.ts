// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonBase } from './ButtonBase';
import type { ButtonBaseProps } from './ButtonBase';


const meta: Meta<ButtonBaseProps> = {
  title: 'Button/ButtonBase',  
  component: ButtonBase,       
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' }, 
    size: { 
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] } 
    },  
  },
  args: {
    disabled: false,
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<ButtonBaseProps>;

export const Large: Story = {
  args: {
    label: 'Button',
    size: 'lg',
    disabled: false,
 
  },
};

export const Medium: Story = {
  args: {
    label: 'Button',
    size: 'md',
    disabled: false,
 
  },
};
export const Small: Story = {
  args: {
    label: 'Button',
    size: 'sm',
    disabled: false,

  },
};
export const SuperSmall: Story = {
  args: {
    label: 'Label',
    size: 'xs',
    disabled: false,
  },
};
