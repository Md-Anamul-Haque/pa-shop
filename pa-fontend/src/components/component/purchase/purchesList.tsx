import { Input } from '@/components/ui/input';
import { purchaseDetailType } from '@/types/tables.type';

import { purchaseSlice, selectPurchase, useDispatch, useSelector } from '@/lib/redux';
import _ from 'lodash';
import { ChangeEvent, FC, useEffect, useRef } from 'react';
import SelectProduct from './selectProduct';
// "use client"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function ActionButton({ label }: { label: string | number }) {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <p className='inline group/dropbtn p-1 border rounded  hover:border-pink-600'>
                    <span className='group-hover/dropbtn:hidden' transition-all duration-300 ease-in-out>{String(label)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hidden group-hover/dropbtn:inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>

                </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
                <DropdownMenuLabel className=''>row</DropdownMenuLabel>
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuRadioItem onClick={() => alert('top')} value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem onClick={() => alert('bottom')} value="bottom">Bottom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem onClick={() => alert('right')} value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const ProductTr: FC<{ indexOfrow: number; purchaseDt?: purchaseDetailType; onChange: (pur: purchaseDetailType) => void; }> = ({ indexOfrow, purchaseDt, onChange }) => {
    const total = () => (Number(purchaseDt?.qty) * Number(purchaseDt?.unit_price))
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const nm = e.target.name;
        console.log({ inputValue, nm })
        if (!(nm == 'qty' || nm == 'unit_price') || !purchaseDt) return;
        const name: 'qty' | 'unit_price' = nm;
        const newValue: purchaseDetailType = { ...purchaseDt };
        if (/^-?\d*\.?\d*$/.test(inputValue) || inputValue === '') {
            console.log(name, inputValue, Number(inputValue))
            newValue[name] = Number(inputValue) || 0;
        } else {
            newValue[name] = newValue[name] || 0
        }
        onChange && onChange({ ...newValue })
    };

    return (
        <tr>
            <td className='bg-accent text-center'>
                <ActionButton label={indexOfrow + 1} /></td>
            <td>
                {/* NAME='prod_name' */}
                <SelectProduct className='w-full'
                    value={{
                        id: purchaseDt?.prod_id || '',
                        label: purchaseDt?.prod_name || ''
                    }}
                    onSelected={(values) => {
                        if (values) {
                            const { price, prod_name, prod_type, uom, bar_qr_code, brand, category, created_at, prod_id } = values || {}
                            onChange && onChange({ prod_id, qty: 0, unit_price: 0, uom: uom || '', prod_name })
                        } else {
                            onChange && onChange({ prod_id: '', qty: 0, unit_price: 0, uom: '', prod_name: undefined })
                        }
                    }}
                />
            </td>
            <td >
                <input name='qty' className="purchesList input text-right" value={purchaseDt?.qty || 0} onChange={handleInputChange} disabled={!purchaseDt?.prod_id} />
            </td>
            <td><input name='unit_price' title='purches unit price' className="purchesList input text-right" value={purchaseDt?.unit_price || 0} onChange={handleInputChange} disabled={!purchaseDt?.prod_id} /></td>
            {/* <td><input name='Total' value={total() || 0} className="purchesList input text-right cursor-text" disabled={true} /></td> */}
            <td className="purchesList input text-right w-auto cursor-text">
                {String(total() || 0)}
            </td>
        </tr>
    )
}



const PurchesList = () => {
    // const p: productType;
    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const { purchaseDts = [] } = useSelector(selectPurchase);
    const handleChangePurchaseInfo = (dt: purchaseDetailType, i: number) => {
        dispatch(purchaseSlice.actions.setPurchaseDt({
            IndexPur: i, editedPur: dt
        }))
    }
    const handleRemovePurchaseInfo = (pur_id: string, i: number) => {

    }
    const handlePushPurchaseInfo = (dt: purchaseDetailType) => {
        dispatch(purchaseSlice.actions.pushPurchase({
            purchaseDetail: dt
        }))
    }
    useEffect(() => {
        if (ref.current) {
            const windowHeight = window.innerHeight || 0;
            const offsetTop = ref.current.offsetTop || 0;
            ref.current.style.maxHeight = `${windowHeight - (offsetTop + 10)}px`;
        }
    }, []);
    return (
        <div className="w-full">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-xl">Purches List</h1>
                <div className="flex gap-2">
                    <Input className="purchesList input" />
                    <button className="input py-1 rounded-md">Search</button>
                </div>
            </div>
            <div ref={ref} className='relative w-full h-fit overflow-auto '>
                <table className="colspan border-collapse w-full">
                    <thead className='sticky top-0 bg-accent z-10 h-fit w-full'>
                        <tr>
                            <th className="purchesList border w-6">SL</th>
                            <th className="purchesList border w-40">prod_name</th>
                            <th className="purchesList border w-16">QTY</th>
                            <th className="purchesList border w-24" title='purches unit price' >pur_price</th>
                            <th className="purchesList border w-28">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            purchaseDts.map((purchaseDt, i) => (
                                <ProductTr onChange={(prodInfo) => {
                                    handleChangePurchaseInfo(prodInfo, i)
                                }} purchaseDt={purchaseDt} key={String(i + 100)} indexOfrow={i} />
                            ))
                        }
                        <ProductTr onChange={handlePushPurchaseInfo} indexOfrow={purchaseDts.length} />
                        <tr className='border'>
                            <td className='text-right border px-2 py-1' colSpan={4}>_SUM : </td>
                            <td className='text-right border px-2 py-1'>{_.sumBy(purchaseDts, (purchase) => purchase.qty * purchase.unit_price)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PurchesList

