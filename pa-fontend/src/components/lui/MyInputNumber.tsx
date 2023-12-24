import React, { useEffect, useState } from "react";
export const MyInputNumberVariants = {
    isValidValue: (value: number | string) => {
        return (/^-?\d*\.?\d*$/.test(String(value)) || value === '')
    }
}

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
}

const MyInputNumber = React.forwardRef<HTMLInputElement, InputProps>(({ type, value, onChange, max, ...props }, ref) => {
    const [val, setVal] = useState(value);
    useEffect(() => {
        setVal(value)
    }, [value])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (MyInputNumberVariants.isValidValue(inputValue)) {
            if (max && Number(inputValue) > Number(max)) {
                e.target.value = String(max);
                setVal(max)
            } else {
                setVal(inputValue)
            }
            onChange && onChange(e)
        } else {
            setVal(String(val).replace(/\d/g, ''))
        }
    }
    return (
        <input ref={ref} accept="number" value={val} onChange={handleChange} type="text" {...props} />
    )
}
)
MyInputNumber.displayName = "MyInputNumber"

export default MyInputNumber;
