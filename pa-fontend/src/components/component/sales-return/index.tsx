import { FC, useEffect, useState } from 'react';
import PurchesListMobile from './SalesReturnHandlerMobile';
import PurchesListPc from './SalesReturnHandlerPc';

const SaleReturnHandler: FC<{ onNext: (incre: number) => void; onSubmited: () => void; }> = ({ onNext, onSubmited }) => {
    const [isPc, setIsPc] = useState(true)
    useEffect(() => {
        setIsPc(window.innerWidth > 768)
        const resizeHandler = () => {
            setIsPc(window.innerWidth > 768)
        }
        window.addEventListener('resize', resizeHandler)
        return () => {
            window.removeEventListener('resize', resizeHandler)
        }
    }, []);
    if (isPc) {
        return (<PurchesListPc onSubmited={onSubmited} onNext={onNext} />)
    }
    return (<PurchesListMobile onSubmited={onSubmited} onNext={onNext} />)
}

export default SaleReturnHandler