import { MyInputNumberVariants } from "@/components/lui/MyInputNumber";
import { PropsOfInputRow } from "./rowOf_pc"
import { ChangeEvent, useEffect, useRef } from "react";
import SelectStockProduct from "../../selectStockProduct";
import SelectProduct from "../../../purchase/selectProduct";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, TextField } from "@mui/material";
import { TrashIcon } from "@radix-ui/react-icons";


const Input_rowOfMobile = ({ rowIndex, dtData, onChange, isFocus, ...props }: PropsOfInputRow) => {
    const total = () => (Number(dtData?.qty) * Number(dtData?.unit_price))

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const nm = e.target.name;
        if (!(nm == 'qty' || nm == 'unit_price') || !dtData) return;
        const name: 'qty' | 'unit_price' = nm;
        const newValue = { ...dtData };
        if (name == 'qty' && (dtData.stocProduct?.qty || 0) <= (Number(inputValue) || 0)) {
            newValue.qty = dtData.stocProduct?.qty || 0;
        } else if (MyInputNumberVariants.isValidValue(inputValue)) {
            newValue[name] = inputValue
        } else {
            newValue[name] = newValue[name] || 0
        }
        onChange({ ...newValue })
    };
    const handleKeyDown = (e: KeyboardEvent, name: string) => {
        console.log(e.key)
        if (e.key == "ArrowUp") {
            e.preventDefault();
            props.onChangeFocus({
                rowNumber: rowIndex - 1,
                key: name,
                isNext: false,
            });
        } else if (e.key == "ArrowDown") {
            e.preventDefault();
            props.onChangeFocus({
                rowNumber: rowIndex + 1,
                key: name,
                isNext: true
            });
        }
    };
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


    if (!dtData?.prod_id) {
        return props.fetchFrom == 'stock' ? (
            <SelectStockProduct className='w-full'
                value={{
                    id: '',
                    label: ''
                }}
                onSelected={onChange}
            />
        ) : (<SelectProduct className='w-full'
            value={{
                id: '',
                label: ''
            }}
            onSelected={onChange}
        />)
    }
    return (
        <AccordionItem className='border px-2' value={"item-" + rowIndex + dtData.prod_id}>
            <AccordionTrigger className='flex justify-between'>{dtData?.prod_name}</AccordionTrigger>
            <AccordionContent className='p-3 border'>
                <div className='block space-y-5'>
                    {props.fetchFrom == 'stock' ?
                        <SelectProduct className='w-full'
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
                        />}

                    <div className='space-y-10'>
                        {
                            props.fetchFrom == 'stock' ?
                                <TextField
                                    helperText={dtData?.stocProduct?.prod_id ? `max qty is : ${dtData?.stocProduct?.qty}` : 'select a product'}
                                    autoComplete='off'
                                    size='small'
                                    label={`${dtData?.uom} of qty :`}
                                    name='qty'
                                    ref={qtyRef}
                                    className="input text-right"
                                    value={dtData?.qty || ''}
                                    placeholder='qty:0'
                                    onChange={handleInputChange}
                                    disabled={!dtData?.prod_id}

                                /> :
                                <TextField
                                    autoComplete='off'
                                    size='small'
                                    label={`${dtData?.uom} of qty :`}
                                    name='qty'
                                    ref={qtyRef}
                                    className="input text-right"
                                    value={dtData?.qty || 0}
                                    onChange={handleInputChange}
                                    disabled={!dtData?.prod_id}
                                />
                        }
                        {
                            props.fetchFrom == 'stock' ?
                                <TextField
                                    autoComplete='off'
                                    size='small'
                                    label='unit_price'
                                    name='unit_price'
                                    ref={unit_priceRef}
                                    title='purches unit price'
                                    className="purchesList input mt-6 text-right"
                                    value={dtData?.unit_price || ''}
                                    placeholder='unit_price:0.00'
                                    onChange={handleInputChange}
                                    disabled={!dtData?.prod_id}
                                /> :
                                <TextField
                                    autoComplete='off'
                                    size='small'
                                    label='unit_price'
                                    name='unit_price'
                                    ref={unit_priceRef}
                                    title='purches unit price'
                                    className="purchesList input text-right"
                                    value={dtData?.unit_price || 0}
                                    onChange={handleInputChange}
                                    disabled={!dtData?.prod_id}
                                />
                        }
                    </div>
                    <div className='flex justify-between'>
                        <p>Total: {String(total() || '0')}</p>
                        <Button onClick={() => {
                            props.onRemoveRow(rowIndex)
                        }} variant='contained' size='small' color='warning'>
                            <TrashIcon className='w-6 h-6' />
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default Input_rowOfMobile