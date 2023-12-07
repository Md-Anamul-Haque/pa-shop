import { salesDetailType } from '@/types/tables.type';

import { Button as ShadCnUiButton } from '@/components/ui/button';
import { salesSlice, selectSales, useDispatch, useSelector } from '@/lib/redux';
import { useEffect, useRef, useState } from 'react';

import { Accordion } from '@/components/ui/accordion';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { TimerIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { DatePicker } from '../../DatePicker';
import { ProductTrMobile } from './ProductTr.Mobile';
import { handleSubmitSales } from './handleSubmitSales';





const SalesHandlerMobile = ({ onNext, onSubmited }: { onNext: (incre: number) => void; onSubmited: () => void; }) => {
    const [isLoading, setIsLoading] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const [defaultValue, setDefaultValue] = useState("")

    const { saleDts = [], isFocus, saleMt, customer, _sum } = useSelector(selectSales);
    const handleChangeSalesInfo = (dt: salesDetailType, i: number) => {
        dispatch(salesSlice.actions.setSaleDt({
            IndexSale: i, editedSale: dt
        }))
    }

    const handlePushSalesInfo = (dt: salesDetailType) => {
        const indexOfrow = saleDts.length
        const a = "item-" + indexOfrow + dt?.prod_id
        setTimeout(() => {
            setDefaultValue(a)
        }, 300);
        // ------------
        dispatch(salesSlice.actions.pushSale({ saleDetail: dt }))
    }
    useEffect(() => {
        if (ref.current) {
            const windowHeight = window.innerHeight || 0;
            const offsetTop = ref.current.offsetTop || 0;
            ref.current.style.maxHeight = `${windowHeight - (offsetTop + 10)}px`;
        }
    }, []);
    const totalSumBy = () => _.sumBy(saleDts, (sale) => Number(sale.qty || 0) * Number(sale.unit_price || 0));

    const handleSubmit = () => {
        if (!customer || !saleMt) {
            console.log({ customer, saleMt })
            return
        }
        handleSubmitSales({ customer, saleMt, saleDts, isLoading, setIsLoading, onSubmited })
    }
    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-around items-center py-1">
                <Button variant='contained' onClick={() => onNext(-1)}>Back</Button>
                <h1 className="text-xl">Purches List</h1>
            </div>
            <div ref={ref} className='relative h-fit overflow-auto '>

                <Accordion value={defaultValue} onValueChange={setDefaultValue} type="single" className='space-y-3' collapsible>
                    {
                        saleDts.map((saleDt, i) => (
                            <ProductTrMobile isFocus={isFocus} dispatch={dispatch} onChange={(prodInfo) => {
                                handleChangeSalesInfo(prodInfo, i)
                            }} saleDt={saleDt} key={String(i + 100)} indexOfrow={i} />
                        ))
                    }
                    <ProductTrMobile dispatch={dispatch} onChange={handlePushSalesInfo} indexOfrow={saleDts.length} />

                </Accordion>
                {/* <div className='border mt-2 flex'>
                    <p className='text-right border px-2 py-1'>_SUM : </p>
                    <p className='text-right border px-2 py-1'>{_sum}</p>
                </div> */}
                <table className='border mt-3'>
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
                                <DatePicker value={saleMt?.sales_date ? new Date(saleMt?.sales_date) : undefined} onSelect={(date) => {
                                    dispatch(salesSlice.actions.handleSetSales_date(date?.toISOString()))
                                }} />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >discount:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={saleMt?.discount} size="small" label="discount:{'- ৳'}" type="number" onChange={e => {
                                    dispatch(salesSlice.actions.handleSetDiscount(e.target.value))
                                }}
                                    disabled={!(_sum || saleDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >vat:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={saleMt?.vat} size="small" label="vat:{'- ৳'}" type="number"
                                    onChange={e => {
                                        dispatch(salesSlice.actions.handleSetVat(e.target.value))
                                    }}
                                    disabled={!(_sum || saleDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >paid_amt:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={saleMt?.paid_amt} size="small" label="paid_amt:{'- ৳'}" type="number"
                                    onChange={e => {
                                        dispatch(salesSlice.actions.handleSetPaid_amt(e.target.value))
                                    }}
                                    disabled={!(_sum || saleDts.length)}
                                    required />
                            </td>
                        </tr>


                        {/* <tr className='border'>
                            <td className='text-right border px-2 py-1'>total amt:</td>
                            <td className='text-right border px-2 py-1'>{_sum}</td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' >due:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                {_sum - Number(saleMt?.paid_amt || 0)}
                            </td>
                        </tr> */}
                        <tr className='border'>
                            <td className=' font-mono text-center border px-2 py-1' colSpan={2}>total amt:{'- ৳'} :{_sum} &nbsp; . due:{'- ৳'} :{_sum - Number(saleMt?.paid_amt || 0)} </td>
                        </tr>

                        <tr>
                            <td className='' colSpan={6}>
                                <ShadCnUiButton isLoading={isLoading} onClick={handleSubmit} className="w-full" type="submit" disabled={!(_sum || saleDts.length)}>
                                    sell now
                                </ShadCnUiButton>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default SalesHandlerMobile

