import { Card } from '@/components/ui/card'
import { apiResponceType } from '@/types/apiResponceType';
import axios from 'axios';
import { FC, useEffect, useState } from 'react'

type purProps = {
    pur_id: string;
    discount: string;
    vat: string;
    paid_amt: string;
    supp_name: string;
    pur_date: string;
    total_purchase_amount: string;
}
const Pur: FC<purProps> = ({ total_purchase_amount, pur_date, supp_name, discount, paid_amt, vat }) => {
    const d = new Date(pur_date)
    const date = `${d.getDate()}/${d.getMonth()}/${String(d.getFullYear()).slice(2)}`;
    const _sum = (Number(total_purchase_amount) + Number(vat)) - Number(discount);
    return (
        <Card className=' hover:shadow-2xl opacity-85 hover:font-bold hover:opacity-100 hover:scale-105 transition-all duration-200 ease-in p-5'>
            <small>from : {supp_name}</small>
            <h5 className='text-xl' >
                date: {date}
            </h5>
            <div className='font-mono px-3 py-1'>
                <p>amount :{total_purchase_amount}</p>
                <p>discount : {discount}</p>
                <p>vat:{vat}</p>
                <hr />
                <p className='font-thin '>{'=> '} {_sum}</p>
                <hr />
                <small>paid_amt : {paid_amt}</small>
                <p>due : {_sum - Number(paid_amt)}</p>
            </div>
        </Card>
    )
}

const PurchaseList = () => {
    const [purchases, setpurchases] = useState<purProps[]>([]);
    useEffect(() => {
        axios.get('/api/purchase')
            .then(({ data }: { data: apiResponceType<purProps[]> }) => {
                if (data.success) {
                    setpurchases(data.payload)
                } else {

                }
            })
            .catch()
            .finally()
    }, []);
    return (
        <div className='flex gap-3 justify-center flex-wrap'>
            {purchases.map(purchase => <Pur {...purchase} />)}
        </div>
    )
}

export default PurchaseList