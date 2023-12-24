import { salesDetailType } from '@/types/tables.type';

import { Button as ShadCnUiButton } from '@/components/ui/button';
import { salesEditDetailType, salesEditSlice, selectSalesEdit, useDispatch, useSelector } from '@/lib/redux';
import { TextField } from '@mui/material';
import { TimerIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { DatePicker } from '../DatePicker';
import { ProductTrPc } from './ProductTr.pc';
import { handleSaveEditSales } from './handleSaveEditSales';




const SalesHandlerPc = ({ onSubmited }: { onSubmited: () => void; }) => {
    const [isLoading, setIsLoading] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const salesEditState = useSelector(selectSalesEdit);
    const { saleDts = [], isFocus, saleMt, _sum } = salesEditState
    const handleChangeSalesInfo = (dt: salesEditDetailType, i: number) => {
        dispatch(salesEditSlice.actions.setSaleDt({
            IndexSale: i, editedSal: dt
        }))
    }

    const handlePushSalesInfo = (dt: salesDetailType) => {

        dispatch(salesEditSlice.actions.pushSale({ saleDetail: dt }))
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
        handleSaveEditSales({ salesEditState, isLoading, setIsLoading, onSubmited })
    }
    return (
        <div className="w-full">
            <div className="flex justify-around items-center py-1">
                {/* <Button variant='contained' onClick={() => onNext(-1)}>Back</Button> */}
                <h1 className="text-xl">Purches List</h1>
                {/* <form className="space-x-2">
                    <Input label="search " className=" w-56" />
                </form> */}
                <span></span>
            </div>
            <div ref={ref} className='relative h-fit'>
                <table className="colspan border-collapse w-full">
                    <thead className='sticky top-0 bg-accent z-10 h-fit w-full'>
                        <tr>
                            <th className="salechesList border w-9">SL</th>
                            <th className="salechesList border w-44">prod_name</th>
                            <th className="salechesList border w-20">QTY</th>
                            <th className="salechesList border w-10">uom</th>
                            <th className="salechesList border w-32" title='purches unit price' >pur_price</th>
                            <th className="salechesList border w-36">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            saleDts.map((saleDt, i) => (
                                <ProductTrPc isFocus={isFocus} dispatch={dispatch} onChange={(prodInfo) => {
                                    handleChangeSalesInfo(prodInfo, i)
                                }} saleDt={saleDt} key={String(i + 100)} indexOfrow={i} />
                            ))
                        }
                        <ProductTrPc dispatch={dispatch} onChange={handlePushSalesInfo} indexOfrow={saleDts.length} />
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>Totals : </td>
                            <td className='text-right border px-2 py-1'>{totalSumBy()}</td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right w-full border px-2 py-1' colSpan={5}>
                                <span className='flex justify-end space-x-3 items-center'>
                                    pur_date <TimerIcon /> :
                                </span>
                            </td>
                            <td className='text-right min-w-max border px-2 py-1'>
                                <DatePicker className='w-36' value={saleMt?.sales_date ? new Date(saleMt?.sales_date) : typeof saleMt?.sales_date !== 'undefined' ? undefined : new Date()} onSelect={(date) => {
                                    dispatch(salesEditSlice.actions.handleSetSales_date(date?.toISOString()))
                                }} />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>discount:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={saleMt?.discount} size="small" label="discount:{'- ৳'}" type="number" onChange={e => {
                                    dispatch(salesEditSlice.actions.handleSetDiscount(e.target.value))
                                }}
                                    placeholder='0.00'
                                    disabled={!(_sum || saleDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>vat:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={saleMt?.vat} size="small" label="vat:{'- ৳'}" type="number"
                                    onChange={e => {
                                        dispatch(salesEditSlice.actions.handleSetVat(e.target.value))
                                    }}
                                    placeholder='0.00'
                                    disabled={!(_sum || saleDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>paid_amt:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={saleMt?.paid_amt} size="small" label="paid_amt:{'- ৳'}" type="number"
                                    onChange={e => {
                                        dispatch(salesEditSlice.actions.handleSetPaid_amt(e.target.value))
                                    }}
                                    placeholder='0.00'
                                    disabled={!(_sum || saleDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className=' font-mono text-center border px-2 py-1' colSpan={6}>total amt:{'- ৳'} :{_sum} &nbsp; . due:{'- ৳'} :{_sum - Number(saleMt?.paid_amt || 0)} </td>
                        </tr>
                        <tr>
                            <td className='' colSpan={5}>

                            </td>
                            <td>
                                <ShadCnUiButton isLoading={isLoading} onClick={handleSubmit} className="w-full" type="submit" disabled={!(_sum || saleDts.length)}>
                                    save change sell
                                </ShadCnUiButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SalesHandlerPc
