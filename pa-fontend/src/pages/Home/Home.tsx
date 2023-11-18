/* Core */
import { useEffect, useState } from 'react'

/* Instruments */
import ApiClient from '@/lib/ApiClient'
import {
    counterSlice,
    incrementAsync,
    incrementIfOddAsync,
    selectCount,
    useDispatch,
    useSelector,
} from '@/lib/redux'
const Home = () => {
    const dispatch = useDispatch()
    const count = useSelector(selectCount)
    const [incrementAmount, setIncrementAmount] = useState(2)
    const api = new ApiClient('http://localhost:8000');

    // Example usage
    async function fetchData() {
        try {
            const data = await api.get('/ip');
            console.log('Data:', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div>
            <div className={'styles.row'}>
                <button
                    className={'styles.button'}
                    aria-label="Decrement value"
                    onClick={() => dispatch(counterSlice.actions.decrement())}
                >
                    -
                </button>
                <span className={'styles.value'}>{count}</span>
                <button
                    className={'styles.button'}
                    aria-label="Increment value"
                    onClick={() => dispatch(counterSlice.actions.increment())}
                >
                    +
                </button>
            </div>
            <div className={'styles.row'}>
                <input
                    className={'styles.textbox'}
                    aria-label="Set increment amount"
                    value={incrementAmount}
                    onChange={(e) => setIncrementAmount(Number(e.target.value ?? 0))}
                />
                <button
                    className={'styles.button'}
                    onClick={() =>
                        dispatch(counterSlice.actions.incrementByAmount(incrementAmount))
                    }
                >
                    Add Amount
                </button>
                <button
                    className={'styles.asyncButton'}
                    onClick={() => dispatch(incrementAsync(incrementAmount))}
                >
                    Add Async
                </button>
                <button
                    className={'styles.button'}
                    onClick={() => dispatch(incrementIfOddAsync(incrementAmount))}
                >
                    Add If Odd
                </button>
            </div>
        </div>
    )
}

export default Home