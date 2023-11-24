import { Button } from "@/components/ui/button";
import { supplierGetAsync, useDispatch } from "@/lib/redux";
import { Input } from "@mui/material";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSupplier: React.FC = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState<string>("");
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
                    dispatch(supplierGetAsync({}));
                    setSearchCount(0);
                }
            }, 1000)
        );

        setSearch(inputVal);
    };

    // Cleanup the timeout on component unmount
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    return (
        <form
            className="flex w-full"
            onSubmit={(e) => {
                e.preventDefault();
                console.log("submit");
                // You might want to fetch data immediately upon form submission if needed
                dispatch(supplierGetAsync({ search }));
                setSearchCount(searchCount + 1);

            }}
        >
            <Input
                fullWidth
                type="search"
                value={search}
                onChange={handleInputChange}
                required
            />
            <Button size="sm" className="mr-1">
                <MagnifyingGlassIcon />
                <span className="hidden lg:inline-block">Search</span>
            </Button>
        </form>
    );
};

export default FilterSupplier;
