import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChangeEvent, useEffect, useRef } from 'react'
import SelectStockProduct from '../../selectStockProduct';
import MyInputNumber from '@/components/lui/MyInputNumber';
import SelectProduct from '../../../purchase/selectProduct';
import { onChangeFocusProps } from '..';


export type PropsOfInputRow = {
    fetchFrom: 'product' | 'stock';
    onRemoveRow: (index: number) => void;
    rowIndex: number;
    dtData?: Record<string, any>;
    onChange: (value?: Record<string, any>) => void;
    isFocus?: {
        key: string;
        rowNumber: number;
    };
    // total: number;
    onChangeFocus: (option: onChangeFocusProps) => void;
}
function ActionButton({ onRemoveRow, rowIndex, dtData }: { onRemoveRow: (index: number) => void; rowIndex: number | number; dtData?: any; }) {
    if (!dtData) {
        return (<span>{String(rowIndex + 1)}</span>)
    }
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <p className='inline group/dropbtn p-1 border rounded w-full hover:border-pink-600'>
                    <span className='group-hover/dropbtn:hidden'>{String(rowIndex + 1)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hidden group-hover/dropbtn:inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>

                </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
                <DropdownMenuLabel className=''>row</DropdownMenuLabel>
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuRadioItem onClick={() => {
                    console.log(dtData)
                    dtData && onRemoveRow(rowIndex)
                }} value="delete">delete</DropdownMenuRadioItem>
                {/* <DropdownMenuRadioItem onClick={() => alert('bottom')} value="bottom">Bottom</DropdownMenuRadioItem> */}
                {/* <DropdownMenuRadioItem onClick={() => alert('right')} value="right">Right</DropdownMenuRadioItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};
const Input_rowOfpc = ({ rowIndex, dtData, onChange, isFocus, ...props }: PropsOfInputRow) => {
    const total = () => (Number(dtData?.qty) * Number(dtData?.unit_price))


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const nm = e.target.name;
        if (!(nm == 'qty' || nm == 'unit_price') || !dtData) return;
        const name: 'qty' | 'unit_price' = nm;
        const newValue = { ...dtData };
        if (name == 'qty' && (dtData.stocProduct?.qty || 0) <= (Number(inputValue) || 0)) {
            newValue.qty = dtData.stocProduct?.qty || 0;
        } else {
            newValue[name] = inputValue
        }
        onChange && onChange({ ...newValue })
    };

    const handleKeyDown = (e: KeyboardEvent, name: string) => {
        console.log(e.key)
        if (e.key == "ArrowUp") {
            e.preventDefault();
            props.onChangeFocus({
                rowNumber: rowIndex - 1,
                key: name,
                isNext: false,
            })
        } else if (e.key == "ArrowDown") {
            e.preventDefault();
            props.onChangeFocus({
                rowNumber: rowIndex + 1,
                key: name,
                isNext: true
            })
        }
    }
    const qtyRef = useRef<HTMLInputElement>(null)
    const unit_priceRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isFocus?.rowNumber !== rowIndex) return
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
                <ActionButton {...{ onRemoveRow: props.onRemoveRow, rowIndex, dtData }} /></td>
            <td>
                {/* NAME='prod_name' */}
                {props.fetchFrom == 'stock' ?
                    <SelectStockProduct className='w-full'
                        value={{
                            id: dtData?.prod_id || '',
                            label: dtData?.prod_name || ''
                        }}
                        onSelected={onChange}
                    /> :
                    <SelectProduct className='w-full'
                        value={{
                            id: dtData?.prod_id || '',
                            label: dtData?.prod_name || ''
                        }}
                        onSelected={onChange}
                    />
                }
            </td>
            <td>
                {
                    props.fetchFrom == 'stock' ?
                        <MyInputNumber
                            title={dtData?.stocProduct?.prod_id ? `max qty is : ${dtData?.stocProduct?.qty}` : 'select a product'}
                            max={dtData?.stocProduct?.qty}
                            autoComplete='off'
                            name='qty'
                            ref={qtyRef}
                            className=" input text-right"
                            value={dtData?.qty || ''}
                            placeholder={dtData?.prod_id ? 'qty:0' : ''}
                            onChange={handleInputChange}
                            disabled={!dtData?.prod_id}
                        /> :
                        <MyInputNumber
                            autoComplete='off'
                            name='qty'
                            ref={qtyRef}
                            className="input text-right"
                            value={dtData?.qty ?? ''}
                            placeholder='qty:0'
                            onChange={handleInputChange}
                            disabled={!dtData?.prod_id}
                        />
                }
            </td>
            <td>
                :{dtData?.uom}
            </td>
            <td>
                {
                    props.fetchFrom == 'stock' ?
                        <MyInputNumber
                            autoComplete='off'
                            name='unit_price'
                            ref={unit_priceRef}
                            title='purches unit price'
                            className="input text-right"
                            value={dtData?.unit_price || ''}
                            placeholder={dtData?.prod_id ? 'unit_price:0.00' : ''}
                            onChange={handleInputChange}
                            disabled={!dtData?.prod_id}
                        /> :
                        <MyInputNumber
                            autoComplete='off'
                            name='unit_price'
                            ref={unit_priceRef}
                            title='purches unit price'
                            className="input text-right"
                            value={dtData?.unit_price ?? ''}
                            placeholder='unit:0.00'
                            onChange={handleInputChange}
                            disabled={!dtData?.prod_id}
                        />
                }
            </td>
            <td className=" input text-right w-auto cursor-text">
                {String(total() || 0)}
            </td>
        </tr>
    )
}

export default Input_rowOfpc