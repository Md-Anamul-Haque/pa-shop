import { salesDetailType } from '@/types/tables.type';

import { salesEditSlice } from '@/lib/redux';
import { ChangeEvent, FC, useEffect, useRef } from 'react';

import { MyInputNumberVariants } from '@/components/lui/MyInputNumber';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { TrashIcon } from '@radix-ui/react-icons';
import SelectProduct from '../purchase/selectProduct';
import SelectStockProduct from '../sales/selectStockProduct';


type trProps = {
    dispatch: any; indexOfrow: number; saleDt?: salesDetailType; onChange: (pur: salesDetailType) => void;
    isFocus?: {
        key: string;
        rowNumber: number;
    }
};
export const ProductTrMobile: FC<trProps> = ({ dispatch, indexOfrow, saleDt, onChange, isFocus }) => {
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
        } else if (MyInputNumberVariants.isValidValue(inputValue)) {
            console.log(name, inputValue, Number(inputValue))
            newValue[name] = inputValue
        } else {
            newValue[name] = newValue[name] || 0
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
    if (!saleDt?.prod_id) {
        return (
            <SelectStockProduct className='w-full'
                value={{
                    id: '',
                    label: ''
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
        )
    }
    return (
        <AccordionItem className='border px-2' value={"item-" + indexOfrow + saleDt.prod_id}>
            <AccordionTrigger className='flex justify-between'>{saleDt?.prod_name}</AccordionTrigger>
            <AccordionContent className='p-3 border'>
                <div className='block space-y-5'>
                    <SelectProduct className='w-full'
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


                    <div className='space-y-10'>
                        <TextField
                            helperText={saleDt?.stocProduct?.prod_id ? `max qty is : ${saleDt?.stocProduct?.qty}` : 'select a product'}
                            autoComplete='off'
                            size='small'
                            label={`${saleDt?.uom} of qty :`}
                            name='qty'
                            ref={qtyRef}
                            className="purchesList input text-right"
                            value={saleDt?.qty || ''}
                            placeholder='qty:0'
                            onChange={handleInputChange}
                            disabled={!saleDt?.prod_id}

                        />
                        <TextField
                            autoComplete='off'
                            size='small'
                            label='unit_price'
                            name='unit_price'
                            ref={unit_priceRef}
                            title='purches unit price'
                            className="purchesList input mt-6 text-right"
                            value={saleDt?.unit_price || ''}
                            placeholder='unit_price:0.00'
                            onChange={handleInputChange}
                            disabled={!saleDt?.prod_id}
                        />
                    </div>
                    <div className='flex justify-between'>
                        <p>Total: {String(total() || '')}</p>
                        <Button onClick={() => {
                            setTimeout(() => {
                                dispatch(salesEditSlice.actions.removeSale(indexOfrow))
                            }, 300);
                        }} variant='contained' size='small' color='warning'>
                            <TrashIcon className='w-6 h-6' />
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )

}

