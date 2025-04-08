import { FC, useRef, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useTheme } from '@/contexts/ThemeContext';

interface ColorPickerProps {
    name: string;
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ name, value, onChange }) => {

    const { openPicker, setOpenPicker } = useTheme();
    const pickerRef = useRef<HTMLDivElement>(null);
    const isOpen = openPicker === name;

    const handleClickOutside = (event: MouseEvent) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
            setOpenPicker(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="color-picker-container relative mb-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="block font-medium mb-1">{name}</label>
                    <div className="flex items-center gap-2">
                        <button
                            className="w-10 h-10 rounded border cursor-pointer shadow-sm"
                            style={{ backgroundColor: value }}
                            onClick={() => setOpenPicker(isOpen ? null : name)}
                        />
                        <HexColorInput
                            color={value}
                            onChange={onChange}
                            prefixed
                            className="p-2 border rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    ref={pickerRef}
                    className="absolute z-[1000] top-full mt-2 left-0 shadow-xl"
                >
                    <HexColorPicker color={value} onChange={onChange} />
                </div>
            )}
        </div>
    );
};

export default ColorPicker;