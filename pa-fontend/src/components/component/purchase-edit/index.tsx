import { FC, useEffect, useState } from 'react';
import PurchesEditListPc from './PurchesHandlerEditPc';
import PurchesListEditMobile from './PurchesHandlerEditMobile';

const PurchesEditHandler: FC<{  onSubmited: () => void; }> = ({ onSubmited }) => {
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
        return (<PurchesEditListPc onSubmited={onSubmited}/>)
    }
    return (<PurchesListEditMobile onSubmited={onSubmited}/>)
}

export default PurchesEditHandler