import { salesDetailType } from '@/types/tables.type';

import MyInputNumber from '@/components/lui/MyInputNumber';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { salesEditSlice } from '@/lib/redux';
import { ChangeEvent, FC, useEffect, useRef } from 'react';
import SelectStockProduct from '../sales/selectStockProduct';

function ActionButton({ dispatch, indexOfrow, saleDt }: { dispatch: any; indexOfrow: number | number; saleDt?: salesDetailType; }) {
    const onRemove = () => {
        dispatch(salesEditSlice.actions.removeSale(indexOfrow))
    }
    if (!saleDt) {
        return (<span>{String(indexOfrow + 1)}</span>)
    }
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <p className='inline group/dropbtn p-1 border rounded w-full hover:border-pink-600'>
                    <span className='group-hover/dropbtn:hidden'>{String(indexOfrow + 1)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hidden group-hover/dropbtn:inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>

                </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
                <DropdownMenuLabel className=''>row</DropdownMenuLabel>
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuRadioItem onClick={() => {
                    console.log(saleDt)
                    saleDt && onRemove()
                }} value="delete">delete</DropdownMenuRadioItem>
                {/* <DropdownMenuRadioItem onClick={() => alert('bottom')} value="bottom">Bottom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem onClick={() => alert('right')} value="right">Right</DropdownMenuRadioItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type trProps = {
    dispatch: any; indexOfrow: number; saleDt?: salesDetailType; onChange: (sale: salesDetailType) => void;
    isFocus?: {
        key: string;
        rowNumber: number;
    }
};
export const ProductTrPc: FC<trProps> = ({ dispatch, indexOfrow, saleDt, onChange, isFocus }) => {
    const total = () => (Number(saleDt?.qty) * Number(saleDt?.unit_price))


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const nm = e.target.name;
        console.log({ inputValue, nm })
        if (!(nm == 'qty' || nm == 'unit_price') || !saleDt) return;
        const name: 'qty' | 'unit_price' = nm;
        const newValue: salesDetailType = { ...saleDt };
        if (name == 'qty' && (saleDt.stocProduct?.qty || 0) <= (Number(inputValue) || 0)) {
            newValue.qty = saleDt.stocProduct?.qty || 0;
        } else {
            newValue[name] = inputValue
        }
        onChange && onChange({ ...newValue })
    };

    const handleKeyDown = (e: KeyboardEvent, name: string) => {
        console.log(e.key)
        if (e.key == "ArrowUp") {
            e.preventDefault();
            dispatch(salesEditSlice.actions.changeFocus({
                rowNumber: indexOfrow - 1,
                key: name,
                isNext: false,
            }));
        } else if (e.key == "ArrowDown") {
            e.preventDefault();
            dispatch(salesEditSlice.actions.changeFocus({
                rowNumber: indexOfrow + 1,
                key: name,
                isNext: true
            }));
        }
    }
    const qtyRef = useRef<HTMLInputElement>(null)
    const unit_priceRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (isFocus?.rowNumber !== indexOfrow) return
        if (isFocus?.key == 'qty') {
            qtyRef.current?.focus()
        } else if (isFocus?.key == 'unit_price') {
            unit_priceRef.current?.focus()
        }
    }, [isFocus]);
    useEffect(() => {
        qtyRef.current?.addEventListener('keydown', e => handleKeyDown(e, 'qty'));
        unit_priceRef.current?.addEventListener('keydown', e => handleKeyDown(e, 'unit_price'));
    }, [qtyRef, unit_priceRef]);
    return (
        <tr>
            <td className='bg-accent text-center'>
                <ActionButton dispatch={dispatch} saleDt={saleDt} indexOfrow={indexOfrow} /></td>
            <td>
                {/* NAME='prod_name' */}
                <SelectStockProduct className='w-full'
                    value={{
                        id: saleDt?.prod_id || '',
                        label: saleDt?.prod_name || ''
                    }}
                    onSelected={(values) => {
                        if (values) {
                            const { prod_id, qty, unit_price, uom, prod_name } = values || {}
                            onChange && onChange({ prod_id, qty: 0, unit_price, uom, prod_name, stocProduct: { qty, price: unit_price, prod_id, prod_name } })
                        } else {
                            onChange && onChange({ prod_id: '', qty: 0, unit_price: 0, uom: '', prod_name: undefined, stocProduct: undefined })
                        }
                    }}
                />
            </td>
            <td >
                <MyInputNumber
                    title={saleDt?.stocProduct?.prod_id ? `max qty is : ${saleDt?.stocProduct?.qty}` : 'select a product'}
                    max={saleDt?.stocProduct?.qty}
                    autoComplete='off'
                    name='qty'
                    ref={qtyRef}
                    className="salechesList input text-right"
                    value={saleDt?.qty || ''}
                    placeholder={saleDt?.prod_id ? 'qty:0' : ''}
                    onChange={handleInputChange}
                    disabled={!saleDt?.prod_id}
                />
            </td>
            <td>
                :{saleDt?.uom}
            </td>
            <td><MyInputNumber
                autoComplete='off'
                name='unit_price'
                ref={unit_priceRef}
                title='purches unit price'
                className="salechesList input text-right"
                value={saleDt?.unit_price || ''}
                placeholder={saleDt?.prod_id ? 'unit_price:0.00' : ''}
                onChange={handleInputChange}
                disabled={!saleDt?.prod_id}
            /></td>
            {/* <td><input name='Total' value={total() || 0} className="salechesList input text-right cursor-text" disabled={true} /></td> */}
            <td className="salechesList input text-right w-auto cursor-text">
                {String(total() || 0)}
            </td>
        </tr>
    )
}