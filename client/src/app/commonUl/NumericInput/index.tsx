import React, { useState } from 'react';
import { Input, Tooltip } from 'antd';

interface NumericInputProps {
    style?: React.CSSProperties;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function NumericInput(props: NumericInputProps) {

    const { value, onChange, placeholder } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
            onChange(inputValue);
        }
    };

    // '.' at the end or only '-' in the input box.
    const handleBlur = () => {
        let valueTemp = value;
        if (value?.charAt(value?.length - 1) === '.' || value === '-') {
            valueTemp = value?.slice(0, -1);
        }
        onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    };

    return (
        <Input
            {...props}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            maxLength={12}
            type="number"
        />
    );
}
