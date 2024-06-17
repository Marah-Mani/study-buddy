import React from 'react'

interface Props {
    text: any;
}

export default function TextCapitalize({ text }: Props) {
    const capitalizeText = (input: string) => {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };

    return (
        <>
            {capitalizeText(text)}
        </>
    )
}
