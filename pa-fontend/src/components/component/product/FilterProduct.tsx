import { Button } from "@/components/ui/button"
import { productGetAsync, useDispatch } from "@/lib/redux"
import { Input } from "@mui/material"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

const FilterProduct = () => {
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [searchCount, setSearchCount] = useState<number>(0);

    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
        null
    );
    let [searchParams, setSearchParams] = useSearchParams();
    let params: any = {};
    searchParams.forEach((value, key) => {
        params = { ...params, [key]: value };
    });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = event.target.value;
        if (inputVal) {
            params.search = inputVal;
        } else {
            delete params.search;
        }
        setSearchParams({
            ...params
        }, {
            replace: true
        });
        // Clear the previous timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set a new timeout
        setTypingTimeout(
            setTimeout(() => {
                // Fetch data after 1000ms
                if (!inputVal && searchCount) {
                    dispatch(productGetAsync({}));
                    setSearchCount(0)
                }
            }, 1000)
        );
        setSearch(inputVal);
    };
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);
    return (
        <form className="flex w-full" onSubmit={e => {
            e.preventDefault()
            console.log('submit');
            dispatch(productGetAsync({ search }))
            setSearchCount(searchCount + 1)

        }}>
            <Input fullWidth type="search" onChange={handleInputChange} required />
            <Button size={'sm'} className="mr-1">
                <MagnifyingGlassIcon />
                <span className="hidden lg:inline-block">Search</span>
            </Button>
        </form>
    )
}

export default FilterProduct