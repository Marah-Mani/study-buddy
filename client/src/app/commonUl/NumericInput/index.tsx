import React from 'react';
import { Input } from 'antd';

interface NumericInputProps {
    style?: React.CSSProperties;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength: number;
}

export default function NumericInput(props: NumericInputProps) {
    const { value, onChange, placeholder, maxLength, style } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((reg.test(inputValue) || inputValue === '' || inputValue === '-') && inputValue.length <= maxLength) {
            onChange(inputValue);
        }
    };

    const handleBlur = () => {
        let valueTemp = value;
        if (value?.charAt(value?.length - 1) === '.' || value === '-') {
            valueTemp = value?.slice(0, -1);
        }
        onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    };

    return (
        <Input
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            style={style}
            type="text"
        />
    );
}
