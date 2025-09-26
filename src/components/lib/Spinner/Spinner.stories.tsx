import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from './Spinner';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Spinner',
  component: Spinner,
  parameters: {},
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    fullscreen: false,
  },
};

export const FullScreen: Story = {
  args: {
    fullscreen: true,
  },
};
