"use client"

import * as RadixSlider from "@radix-ui/react-slider"

interface SliderProps {
    value?: number;
    max?: number;
    min?: number;
    step?: number;
    onChange?: (value: number) => void;
}

export default function Slider({ value = 1, onChange, max = 1, min = 0, step = 0.1 }: SliderProps) {
    const handleChange = (newValue: number[]) => {
        onChange?.(newValue[0])
    }

    return (
        <RadixSlider.Root className="group relative flex items-center select-none w-full" defaultValue={[1]} value={[value]} onValueChange={handleChange} max={max} min={min} step={step} aria-label="Volume">
            <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-1">
                <RadixSlider.Range className="absolute transition bg-white rounded-full h-full group-hover:bg-[#22c55e]" />
            </RadixSlider.Track>
            <RadixSlider.Thumb className="transition scale-0 block group-hover:scale-100 w-3 h-3 bg-white rounded-full shadow-md hover:shadow-lg" />
        </RadixSlider.Root>
    )
}