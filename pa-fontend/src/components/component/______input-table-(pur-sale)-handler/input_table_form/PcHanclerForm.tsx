import { Button as ShadCnUiButton } from '@/components/ui/button';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { TimerIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { DatePicker } from '../../DatePicker';
import Input_rowOfpc from './input-fields-of-row/rowOf_pc';
import { HandlerFormProps } from '.';




const PcHanclerForm = ({ onNext, handleSubmit, dtsData, _sum, mtData, isFocus, ...props }: HandlerFormProps) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            const windowHeight = window.innerHeight || 0;
            const offsetTop = ref.current.offsetTop || 0;
            ref.current.style.maxHeight = `${windowHeight - (offsetTop + 10)}px`;
        }
    }, []);
    const totalSumBy = () => _.sumBy(dtsData, (sale) => Number(sale.qty || 0) * Number(sale.unit_price || 0));

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
                            dtsData?.map((dt, i) => (
                                <Input_rowOfpc
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
                        <Input_rowOfpc
                            isFocus={isFocus}
                            fetchFrom={props.fetchFrom}
                            onChangeFocus={props.onChangeFocus}
                            onRemoveRow={props.onRemoveRow}
                            onChange={props.onPushDt}
                            rowIndex={dtsData?.length || 0}
                        />
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>Totals : </td>
                            <td className='text-right border px-2 py-1'>{totalSumBy()}</td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right w-full border px-2 py-1' colSpan={5}>
                                <span className='flex justify-end space-x-3 items-center'>
                                    date <TimerIcon /> :
                                </span>
                            </td>
                            <td className='text-right min-w-max border px-2 py-1'>
                                <DatePicker className='w-36' value={mtData?.date ? new Date(mtData?.date) : typeof mtData?.date !== 'undefined' ? undefined : new Date()}
                                    onSelect={(date) => {
                                        props.onMtChange('date', date?.toISOString())
                                    }} />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>discount:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={mtData?.discount} size="small" label="discount:{'- ৳'}" type="number" onChange={e => {
                                    props.onMtChange('discount', e.target.value)
                                }}
                                    placeholder='0.00'
                                    disabled={!(_sum || dtsData?.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>vat:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={mtData?.vat} size="small" label="vat:{'- ৳'}" type="number"
                                    onChange={e => {
                                        props.onMtChange('vat', e.target.value)
                                    }}
                                    placeholder='0.00'
                                    disabled={!(_sum || dtsData?.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={5}>paid_amt:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                <TextField fullWidth value={mtData?.paid_amt} size="small" label="paid_amt:{'- ৳'}" type="number"
                                    onChange={e => {
                                        props.onMtChange('paid_amt', e.target.value)
                                    }}
                                    placeholder='0.00'
                                    disabled={!(_sum || dtsData?.length)}
                                    required />
                            </td>
                        </tr>
                        <tr className='border'>
                            <td className=' font-mono text-center border px-2 py-1' colSpan={6}>total amt:{'- ৳'} :{_sum} &nbsp; . due:{'- ৳'} :{_sum - Number(mtData?.paid_amt || 0)} </td>
                        </tr>
                        <tr>
                            <td className='' colSpan={5}>

                            </td>
                            <td>
                                <ShadCnUiButton isLoading={props.isSubmiting} onClick={handleSubmit} className="w-full" type="submit" disabled={!(_sum || dtsData?.length)}>
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

export default PcHanclerForm

