import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Default Card',
    children: 'This is a default card with a gray background. Use the Scratchpad panel to add notes about this component.',
  },
};

export const Outlined: Story = {
  args: {
    title: 'Outlined Card',
    children: 'This card has a subtle border. Try adding feedback in the Scratchpad!',
  },
};

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    children: 'This card has a drop shadow for emphasis. Notes you add will persist across sessions.',
  },
};
