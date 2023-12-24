import { purchaseReturnDetailType } from '@/types/tables.type';

import { Button as ShadCnUiButton } from '@/components/ui/button';
import { purchaseReturn_Slice, selectPurchaseReturn, useDispatch, useSelector } from '@/lib/redux';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { TimerIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { DatePicker } from '../DatePicker';
import { ProductTrPc } from './ProductTr.pc';
import { handleSubmitPurchaseReturn } from './handleSubmitPurchaseReturn';




const PurchaseReturnHandlerPc = ({ onNext, onSubmited }: { onNext: (incre: number) => void; onSubmited: () => void; }) => {
    const [isLoading, setIsLoading] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const { purchaseDts = [], isFocus, purchaseMt, supplier, _sum } = useSelector(selectPurchaseReturn);


    const handleChangePurchaseInfo = (dt: purchaseReturnDetailType, i: number) => {
        dispatch(purchaseReturn_Slice.actions.setPurchaseDt({
            IndexPurchase: i, editedPurchase: dt
        }))
    }

    const handlePushPurchasesInfo = (dt: purchaseReturnDetailType) => {
        dispatch(purchaseReturn_Slice.actions.pushPurchase({ purchaseDetail: dt }))
    }

    useEffect(() => {
        if (ref.current) {
            const windowHeight = window.innerHeight || 0;
            const offsetTop = ref.current.offsetTop || 0;
            ref.current.style.maxHeight = `${windowHeight - (offsetTop + 10)}px`;
        }
    }, []);
    const totalSumBy = () => _.sumBy(purchaseDts, (pur) => Number(pur.qty || 0) * Number(pur.unit_price || 0));

    const handleSubmit = () => {
        if (!supplier || !purchaseMt) {
            console.log({ supplier, purchaseMt })
            return
        }
        handleSubmitPurchaseReturn({ supplier, purchaseMt, purchaseDts, isLoading, setIsLoading, onSubmited })
    }
    return (
        <div className="w-full">
            <div className="flex justify-around items-center py-1">
                <Button variant='contained' onClick={() => onNext(-1)}>Back</Button>
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
                            purchaseDts.map((purchaseDt, i) => (
                                <ProductTrPc isFocus={isFocus} dispatch={dispatch} onChange={(prodInfo) => {
                                    handleChangePurchaseInfo(prodInfo, i)
                                }} purchaseDt={purchaseDt} key={String(i + 100)} indexOfrow={i} />
                            ))
                        }
                        <ProductTrPc dispatch={dispatch} onChange={handlePushPurchasesInfo} indexOfrow={purchaseDts.length} />
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
                                <DatePicker className='w-36' value={purchaseMt?.pur_r_date ? new Date(purchaseMt?.pur_r_date) : typeof purchaseMt?.pur_r_date !== 'undefined' ? undefined : new Date()} onSelect={(date) => {
                                    dispatch(purchaseReturn_Slice.actions.handleSetPur_r_date(date?.toISOString()))
                                }} />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>discount:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={purchaseMt?.discount} size="small" label="discount:{'- ৳'}" type="number" onChange={e => {
                                    dispatch(purchaseReturn_Slice.actions.handleSetDiscount(e.target.value))
                                }}
                                    placeholder='0.00'
                                    disabled={!(_sum || purchaseDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>vat:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={purchaseMt?.vat} size="small" label="vat:{'- ৳'}" type="number"
                                    onChange={e => {
                                        dispatch(purchaseReturn_Slice.actions.handleSetVat(e.target.value))
                                    }}
                                    placeholder='0.00'
                                    disabled={!(_sum || purchaseDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}> <b>return</b> paid_amt:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={purchaseMt?.paid_amt} size="small" label="paid_amt:{'- ৳'}" type="number"
                                    onChange={e => {
                                        dispatch(purchaseReturn_Slice.actions.handleSetPaid_amt(e.target.value))
                                    }}
                                    placeholder='0.00'
                                    disabled={!(_sum || purchaseDts.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className=' font-mono text-center border px-2 py-1' colSpan={6}>total amt:{'- ৳'} :{_sum} &nbsp; . due:{'- ৳'} :{_sum - Number(purchaseMt?.paid_amt || 0)} </td>
                        </tr>
                        {/* <tr className='border'>
                            <td colSpan={2} className='text-right border px-2 py-1'>total amt:</td>
                            <td className='text-right border px-2 py-1'>{_sum}</td>
                            <td className='text-right border px-2 py-1' colSpan={2}>due:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                {_sum - Number(purchaseMt?.paid_amt || 0)}
                            </td>
                        </tr> */}

                        <tr>
                            <td className='' colSpan={5}>

                            </td>
                            <td>
                                <ShadCnUiButton isLoading={isLoading} onClick={handleSubmit} className="w-full" type="submit" disabled={!(_sum || purchaseDts.length)}>
                                    purchase return now
                                </ShadCnUiButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PurchaseReturnHandlerPc

