import { Card } from '@/components/ui/card'
import { FC } from 'react'
const Pur: FC = () => {
    return (
        <Card className='w-40 hover:shadow-2xl opacity-85 hover:font-bold hover:opacity-100 hover:scale-105 transition-all duration-200 ease-in h-44 place-items-center grid'>
            <h3 className='text-2xl' >
                {new Date().getDate()}/{new Date().getMonth()}/{String(new Date().getFullYear()).slice(2)}
            </h3>
            <p>supplier</p>
            <p>amt</p>
        </Card>
    )
}
const PurchaseList = () => {
    return (
        <div className='flex gap-3 justify-center flex-wrap'>
            <Pur />
            <Pur />
            <Pur />
            <Pur />
            <Pur />
            <Pur />
            <Pur />
            <Pur />
            <Pur />
            <Pur />
        </div>
    )
}

export default PurchaseList