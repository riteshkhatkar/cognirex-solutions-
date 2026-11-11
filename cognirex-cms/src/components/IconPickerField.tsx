import React from 'react';
import { AVAILABLE_ICON_NAMES, getCmsIcon } from '../utils/iconRegistry';

interface IconPickerFieldProps {
  label?: string;
  value: string;
  onChange: (iconName: string) => void;
}

export const IconPickerField: React.FC<IconPickerFieldProps> = ({
  label = 'Icon',
  value,
  onChange,
}) => {
  const ActiveIcon = getCmsIcon(value);

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C] mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-[#EEE8FA] border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">
          <ActiveIcon className="w-4 h-4" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-xs font-medium bg-white border border-[#E5E1ED] rounded-lg focus:outline-none focus:border-[#7C3AED] cms-input"
        >
          {AVAILABLE_ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
