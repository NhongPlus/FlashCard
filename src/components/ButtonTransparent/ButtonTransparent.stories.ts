import type { Meta, StoryObj } from '@storybook/react';
import { ButtonTransparent } from './ButtonTransparent';
import type { ButtonTransparentProps } from './ButtonTransparent';


const meta: Meta<ButtonTransparentProps> = {
  title: 'Button/ButtonTransparent',  
  component: ButtonTransparent,       
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disable: { control: 'boolean' }, 
    size: { 
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] } 
    },  
  },
  args: {
    disable: false,
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<ButtonTransparentProps>;

export const Large: Story = {
  args: {
    label: 'Button',
    size: 'lg',
    disable: false,
 
  },
};

export const Medium: Story = {
  args: {
    label: 'Button',
    size: 'md',
    disable: false,
 
  },
};
export const Small: Story = {
  args: {
    label: 'Button',
    size: 'sm',
    disable: false,

  },
};
export const SuperSmall: Story = {
  args: {
    label: 'Label',
    size: 'xs',
    disable: false,
  },
};
