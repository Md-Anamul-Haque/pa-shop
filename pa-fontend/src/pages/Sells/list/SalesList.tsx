import { Card } from '@/components/ui/card'
import { apiResponceType } from '@/types/apiResponceType';
import { CalendarIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { FC, useEffect, useState } from 'react'

type purProps = {
    sales_id: string;
    discount: string;
    vat: string;
    paid_amt: string;
    cust_name: string;
    sales_date: string;
    total_sales_amount: string;
}
const Pur: FC<purProps> = ({ total_sales_amount, sales_date, cust_name, discount, paid_amt, vat }) => {
    const d = new Date(sales_date)
    const date = `${d.getDate()}/${d.getMonth()}/${String(d.getFullYear()).slice(2)}`;
    const _sum = (Number(total_sales_amount) + Number(vat)) - Number(discount);
    return (
        <Card className=' hover:shadow-2xl opacity-85 hover:font-bold hover:opacity-100 hover:scale-105 transition-all duration-200 ease-in p-5'>
            <small>to : {cust_name}</small>
            <p className='text-lg text-right flex justify-end items-center' >
                <CalendarIcon />: {date}
            </p>
            <div className='font-mono px-3 py-1'>
                <p>amount :{total_sales_amount}</p>
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

const SalesList = () => {
    const [sales, setSales] = useState<purProps[]>([]);
    useEffect(() => {
        axios.get('/api/sales')
            .then(({ data }: { data: apiResponceType<purProps[]> }) => {
                if (data.success) {
                    setSales(data.payload)
                } else {

                }
            })
            .catch()
            .finally()
    }, []);
    return (
        <div className='flex gap-3 justify-center flex-wrap'>
            {sales.map(sale => <Pur {...sale} />)}
        </div>
    )
}

export default SalesList