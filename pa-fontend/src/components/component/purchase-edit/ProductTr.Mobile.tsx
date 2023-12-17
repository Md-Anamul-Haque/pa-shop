import { purchaseDetailType } from '@/types/tables.type';

import { purchaseEditSlice } from '@/lib/redux';
import { ChangeEvent, FC, useEffect, useRef } from 'react';

import { MyInputNumberVariants } from '@/components/lui/MyInputNumber';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { TrashIcon } from '@radix-ui/react-icons';
import SelectProduct from '../purchase/selectProduct';


type trProps = {
    dispatch: any; indexOfrow: number; purchaseDt?: purchaseDetailType; onChange: (pur: purchaseDetailType) => void;
    isFocus?: {
        key: string;
        rowNumber: number;
    }
};
export const ProductTrMobile: FC<trProps> = ({ dispatch, indexOfrow, purchaseDt, onChange, isFocus }) => {
    const total = () => (Number(purchaseDt?.qty) * Number(purchaseDt?.unit_price))


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const nm = e.target.name;
        console.log({ inputValue, nm })
        if (!(nm == 'qty' || nm == 'unit_price') || !purchaseDt) return;
        const name: 'qty' | 'unit_price' = nm;
        const newValue: purchaseDetailType = { ...purchaseDt };
        if (MyInputNumberVariants.isValidValue(inputValue)) {
            console.log(name, inputValue, Number(inputValue))
            newValue[name] = Number(inputValue) || 0;
        } else {
            newValue[name] = newValue[name] || 0
        }
        onChange && onChange({ ...newValue })
    };

    const handleKeyDown = (e: KeyboardEvent, name: string) => {
        console.log(e.key)
        if (e.key == "ArrowUp") {
            e.preventDefault();
            dispatch(purchaseEditSlice.actions.changeFocus({
                rowNumber: indexOfrow - 1,
                key: name,
                isNext: false,
            }));
        } else if (e.key == "ArrowDown") {
            e.preventDefault();
            dispatch(purchaseEditSlice.actions.changeFocus({
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
    if (!purchaseDt) {
        return (
            <SelectProduct className='w-full'
                value={{
                    id: '',
                    label: ''
                }}
                onSelected={(values) => {
                    if (values) {
                        const { prod_name, uom, prod_id } = values || {}
                        onChange && onChange({ prod_id, qty: 0, unit_price: 0, uom: uom || '', prod_name })
                    } else {
                        onChange && onChange({ prod_id: '', qty: 0, unit_price: 0, uom: '', prod_name: undefined })
                    }
                }}
            />
        )
    }
    return (
        <AccordionItem className='border px-2' value={"item-" + indexOfrow + purchaseDt.prod_id}>
            <AccordionTrigger className='flex justify-between'>{purchaseDt?.prod_name}</AccordionTrigger>
            <AccordionContent className='p-3 border'>
                <div className='block space-y-5'>
                    <SelectProduct className='w-full'
                        value={{
                            id: purchaseDt?.prod_id || '',
                            label: purchaseDt?.prod_name || ''
                        }}
                        onSelected={(values) => {
                            if (values) {
                                const { prod_name, uom, prod_id } = values || {}
                                onChange && onChange({ prod_id, qty: 0, unit_price: 0, uom: uom || '', prod_name })
                            } else {
                                onChange && onChange({ prod_id: '', qty: 0, unit_price: 0, uom: '', prod_name: undefined })
                            }
                        }}

                    />
                    <TextField
                        autoComplete='off'
                        size='small'
                        label={`${purchaseDt?.uom} of qty :`}
                        name='qty'
                        ref={qtyRef}
                        className="purchesList input text-right"
                        value={purchaseDt?.qty || 0}
                        onChange={handleInputChange}
                        disabled={!purchaseDt?.prod_id}
                    />
                    <TextField
                        autoComplete='off'
                        size='small'
                        label='unit_price'
                        name='unit_price'
                        ref={unit_priceRef}
                        title='purches unit price'
                        className="purchesList input text-right"
                        value={purchaseDt?.unit_price || 0}
                        onChange={handleInputChange}
                        disabled={!purchaseDt?.prod_id}
                    />
                    <div className='flex justify-between'>
                        <p>Total: {String(total() || '')}</p>
                        <Button onClick={() => {
                            setTimeout(() => {
                                dispatch(purchaseEditSlice.actions.removePurchase(indexOfrow))
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