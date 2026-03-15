import React from 'react';

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    className?: string;
    position?: 'up' | 'down';
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, className }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={className || "bg-slate-800 text-white p-2 rounded"}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};

export default CustomSelect;
