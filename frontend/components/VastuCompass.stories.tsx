import type { Meta, StoryObj } from '@storybook/react';
import VastuCompass from './VastuCompass';

const meta: Meta<typeof VastuCompass> = {
  title: 'Components/VastuCompass',
  component: VastuCompass,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: { type: 'range', min: 0, max: 360 },
    },
    score: {
      control: { type: 'range', min: 0, max: 100 },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof VastuCompass>;

export const Default: Story = {
  args: {
    direction: 45,
    score: 85,
  },
};

export const Small: Story = {
  args: {
    direction: 90,
    score: 60,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    direction: 180,
    score: 40,
    size: 'lg',
  },
};

export const NoScore: Story = {
  args: {
    direction: 0,
  },
};

export const NorthFacing: Story = {
  args: {
    direction: 0,
    score: 95,
  },
};

export const SouthFacing: Story = {
  args: {
    direction: 180,
    score: 30,
  },
};
