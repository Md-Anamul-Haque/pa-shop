/* Core */

/* Instruments */
import {
    useSelector
} from '@/lib/redux';
import { selectUser } from '@/lib/redux/slices/userSlice';

const Home = () => {
    const user = useSelector(selectUser)
    return (
        <div>
            {JSON.stringify({ user })}
            {/* <div className={'styles.row'}>
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
            </div> */}

        </div>
    )
}

export default Home