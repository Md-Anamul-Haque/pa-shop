import { useEffect, useState } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import MobileHanclerForm from './MobileHanclerForm';
import PcHanclerForm from './PcHanclerForm';
export type onChangeFocusProps = 'none' | {
    rowNumber: number; key: string; isNext: boolean
}
export interface inputTableFieldsState {
    dtsData?: Record<string, any>[];
    mtData?: {
        date?: string;
        discount?: string;
        vat?: string;
        paid_amt?: string;
    } & Record<string, any>;
    // isLoading: boolean;
    error?: string;
    // due: number;
    _sum: number;
}
export type HandlerFormProps = {
    onNext: (incre: number) => void;
    handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    isSubmiting: boolean;
    onRemoveRow: (index: number) => void;
    dispatch: Dispatch;
    onChange: (value?: Record<string, any>) => void;
    onPushDt: (data?: Record<string, any>) => void;
    onMtChange: (key: 'date' | 'discount' | 'vat' | 'paid_amt', value?: string) => void;
    fetchFrom: 'product' | 'stock';
    onChangeFocus: (option: onChangeFocusProps) => void;
    isFocus?: { key: string; rowNumber: number }

} & inputTableFieldsState;
const InputTableForm = ({ ...props }: HandlerFormProps) => {
    const [isPc, setIsPc] = useState(true)
    useEffect(() => {
        setIsPc(window.innerWidth > 768)
        const resizeHandler = () => {
            setIsPc(window.innerWidth > 768)
        }
        window.addEventListener('resize', resizeHandler)
        return () => {
            window.removeEventListener('resize', resizeHandler)
        }
    }, []);
    if (isPc) {
        return (<PcHanclerForm {...props} />)
    }
    return (<MobileHanclerForm {...props} />)
}

export default InputTableForm

