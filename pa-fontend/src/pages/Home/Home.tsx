/* Core */

/* Instruments */
// import {
//     useSelector
// } from '@/lib/redux';
// import { selectUser } from '@/lib/redux/slices/userSlice';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
const Home = () => {
    // const user = useSelector(selectUser)

    const [tisis, setThisIs] = useState(1)
    return (
        <div>
            hello home
            <div className='flex place-items-center'>
                <Button onClick={() => setThisIs(tisis - 1)}>down</Button>
                {tisis == 1 && <h2>this is one</h2>}
                {tisis == 2 && <p>this is two</p>}
                {tisis == 3 && <div>this is three</div>}
                <Button onClick={() => setThisIs(tisis + 1)}>In</Button>
            </div>
            <Carousel className="w-full max-w-xs">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

        </div>
    )
    // return (
    //     <div>
    //         {JSON.stringify({ user })}
    //         {/* <div className={'styles.row'}>
    //             <button
    //                 className={'styles.button'}
    //                 aria-label="Decrement value"
    //                 onClick={() => dispatch(counterSlice.actions.decrement())}
    //             >
    //                 -
    //             </button>
    //             <span className={'styles.value'}>{count}</span>
    //             <button
    //                 className={'styles.button'}
    //                 aria-label="Increment value"
    //                 onClick={() => dispatch(counterSlice.actions.increment())}
    //             >
    //                 +
    //             </button>
    //         </div>
    //         <div className={'styles.row'}>
    //             <input
    //                 className={'styles.textbox'}
    //                 aria-label="Set increment amount"
    //                 value={incrementAmount}
    //                 onChange={(e) => setIncrementAmount(Number(e.target.value ?? 0))}
    //             />
    //             <button
    //                 className={'styles.button'}
    //                 onClick={() =>
    //                     dispatch(counterSlice.actions.incrementByAmount(incrementAmount))
    //                 }
    //             >
    //                 Add Amount
    //             </button>
    //             <button
    //                 className={'styles.asyncButton'}
    //                 onClick={() => dispatch(incrementAsync(incrementAmount))}
    //             >
    //                 Add Async
    //             </button>
    //             <button
    //                 className={'styles.button'}
    //                 onClick={() => dispatch(incrementIfOddAsync(incrementAmount))}
    //             >
    //                 Add If Odd
    //             </button>
    //         </div> */}

    //     </div>
    // )
}

export default Home