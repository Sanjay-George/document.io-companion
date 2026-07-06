import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AnnotationCard from '@/companion/AnnotationCard';
import { sampleNotes } from '@/companion/fixtures';

const noop = () => {};

const meta = {
    title: 'Companion/Components/AnnotationCard',
    component: AnnotationCard,
    args: { selected: false, onSelect: noop, onEdit: noop, onDelete: noop, onReanchor: noop },
    decorators: [
        (Story) => (
            <div className="w-[348px] rounded-dio-container bg-white p-[14px]">{Story()}</div>
        ),
    ],
} satisfies Meta<typeof AnnotationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
    args: { note: sampleNotes[1], selected: false },
};

export const Expanded: Story = {
    args: { note: sampleNotes[3], selected: true },
};

export const OtherPage: Story = {
    args: { note: sampleNotes[4], selected: false },
};

export const Broken: Story = {
    args: { note: sampleNotes[5], selected: false },
};

export const Interactive: Story = {
    args: { note: sampleNotes[2] },
    render: (args) => {
        const [selected, setSelected] = useState(false);
        return <AnnotationCard {...args} selected={selected} onSelect={() => setSelected((v) => !v)} />;
    },
};
