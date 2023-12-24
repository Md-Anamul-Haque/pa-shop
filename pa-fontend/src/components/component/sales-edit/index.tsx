import { useEffect, useState } from 'react';
import SalesHandlerMobile from './SalesHandlerMobile';
import SalesHandlerPc from './SalesHandlerPc';

const SalesEditHandler = ({ onSubmited }: { onSubmited: () => void; }) => {
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
        return (<SalesHandlerPc onSubmited={onSubmited} />)
    }
    return (<SalesHandlerMobile onSubmited={onSubmited} />)
}

export default SalesEditHandler