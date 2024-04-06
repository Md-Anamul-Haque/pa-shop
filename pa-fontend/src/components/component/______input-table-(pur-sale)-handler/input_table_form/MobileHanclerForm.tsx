
import { Button as ShadCnUiButton } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

import { Accordion } from '@/components/ui/accordion';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { TimerIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { DatePicker } from '../../DatePicker';
import { HandlerFormProps } from '.';
import Input_rowOfMobile from './input-fields-of-row/rowOf_mobile';





const MobileHanclerForm = ({ onNext, handleSubmit, dtsData, _sum, mtData, isFocus, ...props }: HandlerFormProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const [defaultValue, setDefaultValue] = useState("")

    // const { dtsData = [], isFocus, mtData, customer, _sum } = useSelector(selectSales);
    // const handleChangeSalesInfo = (dt: salesDetailType, i: number) => {
    //     dispatch(salesSlice.actions.setSaleDt({
    //         IndexSale: i, editedSale: dt
    //     }))
    // }

    // const handlePushSalesInfo = (dt: salesDetailType) => {
    //     const indexOfrow = dtsData?.length
    //     const a = "item-" + indexOfrow + dt?.prod_id
    //     setTimeout(() => {
    //         setDefaultValue(a)
    //     }, 300);
    //     // ------------
    //     dispatch(salesSlice.actions.pushSale({ saleDetail: dt }))
    // }
    useEffect(() => {
        if (ref.current) {
            const windowHeight = window.innerHeight || 0;
            const offsetTop = ref.current.offsetTop || 0;
            ref.current.style.maxHeight = `${windowHeight - (offsetTop + 10)}px`;
        }
    }, []);
    const totalSumBy = () => _.sumBy(dtsData, (sale) => Number(sale.qty || 0) * Number(sale.unit_price || 0));
    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-around items-center py-1">
                <Button variant='contained' onClick={() => onNext(-1)}>Back</Button>
                <h1 className="text-xl">Purches List</h1>
            </div>
            <div ref={ref} className='relative h-fit overflow-auto '>

                <Accordion value={defaultValue} onValueChange={setDefaultValue} type="single" className='space-y-3' collapsible>
                    {
                        dtsData?.map((dt, i) => (
                            <Input_rowOfMobile
                                isFocus={isFocus}
                                onChange={props.onChange}
                                dtData={dt}
                                key={String(i + 100)}
                                rowIndex={i}
                                fetchFrom={props.fetchFrom}
                                onChangeFocus={props.onChangeFocus}
                                onRemoveRow={props.onRemoveRow}
                            />
                        ))
                    }
                    <Input_rowOfMobile
                        isFocus={isFocus}
                        fetchFrom={props.fetchFrom}
                        onChangeFocus={props.onChangeFocus}
                        onRemoveRow={props.onRemoveRow}
                        onChange={props.onPushDt}
                        rowIndex={dtsData?.length || 0}
                    />
                </Accordion>

                {(_sum) && <table className='border mt-3'>
                    <tbody>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >Totals: {'- ৳'}: </td>
                            <td className='text-right border px-2 py-1'>{totalSumBy()}</td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >
                                <span className='flex justify-end space-x-3 items-center'>
                                    pur_date <TimerIcon /> :
                                </span>
                            </td>
                            <td className='text-right border px-2 py-1'>
                                <DatePicker value={mtData?.date ? new Date(mtData?.date) : undefined}
                                    onSelect={(date) => {
                                        props.onMtChange('date', date?.toISOString())
                                    }} />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >discount:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={mtData?.discount} size="small" label="discount:{'- ৳'}" type="number"
                                    onChange={e => {
                                        props.onMtChange('discount', e.target.value)
                                    }}
                                    disabled={!(_sum || dtsData?.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >vat:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={mtData?.vat} size="small" label="vat:{'- ৳'}" type="number"
                                    onChange={e => {
                                        props.onMtChange('vat', e.target.value)
                                    }}
                                    disabled={!(_sum || dtsData?.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >paid_amt:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={mtData?.paid_amt} size="small" label="paid_amt:{'- ৳'}" type="number"
                                    onChange={e => {
                                        props.onMtChange('paid_amt', e.target.value)
                                    }}
                                    disabled={!(_sum || dtsData?.length)}
                                    required />
                            </td>
                        </tr>

                        <tr className='border'>
                            <td className=' font-mono text-center border px-2 py-1' colSpan={2}>total amt:{'- ৳'} :{_sum} &nbsp; . due:{'- ৳'} :{_sum - Number(mtData?.paid_amt || 0)} </td>
                        </tr>

                        <tr>
                            <td className='' colSpan={6}>
                                <ShadCnUiButton isLoading={props.isSubmiting} onClick={handleSubmit} className="w-full" type="submit" disabled={!(_sum || dtsData?.length)}>
                                    sell now
                                </ShadCnUiButton>
                            </td>
                        </tr>
                    </tbody>
                </table>}

            </div>
        </div>
    )
}

export default MobileHanclerForm

