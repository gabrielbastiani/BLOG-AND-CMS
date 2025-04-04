import { FC } from 'react';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ label, value, onChange }) => {
    return (
        <div className="flex items-center gap-4">
            <label className="block text-sm font-medium w-32">{label}</label>
            <input
                type="color"
                value={value || '#000000'} // Fallback para cor inválida
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border"
            />
            <span className="font-mono">{value}</span>
        </div>
    );
};

export default ColorPicker;