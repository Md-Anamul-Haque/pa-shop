import { useEffect, useState } from 'react';
import SalesHandlerMobile from './SalesHandlerMobile';
import SalesHandlerPc from './SalesHandlerPc';

const SalesHandler = ({ onNext, onSubmited }: { onNext: (incre: number) => void; onSubmited: () => void; }) => {
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
        return (<SalesHandlerPc onSubmited={onSubmited} onNext={onNext} />)
    }
    return (<SalesHandlerMobile onSubmited={onSubmited} onNext={onNext} />)
}

export default SalesHandler