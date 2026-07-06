type Variant = 'idle' | 'selected' | 'broken' | 'other';

type Props = {
    number: number;
    variant?: Variant;
};

/**
 * 24px numbered circle used on annotation cards and the popover header.
 * Broken notes show a "!" instead of the number.
 */
export default function NumberCircle({ number, variant = 'idle' }: Props) {
    const skin: Record<Variant, string> = {
        idle: 'bg-white text-dio-accent border-[1.5px] border-dio-accent/50',
        selected: 'bg-dio-accent text-white',
        broken: 'bg-dio-danger-bg text-dio-danger-2',
        other: 'bg-white text-dio-faint border-[1.5px] border-[#DDE0E6]',
    };
    return (
        <span
            className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[12px] font-semibold ${skin[variant]}`}
        >
            {variant === 'broken' ? '!' : number}
        </span>
    );
}
