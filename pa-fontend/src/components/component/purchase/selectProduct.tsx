import SelectCommandFetch, { Option as OptionType } from "@/components/lui/selectCommandFetch";
import ApiClient from "@/lib/ApiClient";
import { productType } from "@/types/tables.type";
import { FC, useCallback, useState } from "react";

type Props = {
    onSelected: (value?: OptionType) => void;
    className?: string
    value?: OptionType;
}
const selectApi = new ApiClient('/api/product')
const ItemChildren: FC<{ item: OptionType }> = ({ item }) => {
    return (
        <p className="w-full text-xs italic">
            {item.label}
        </p>
    )
};

const ProductIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hidden lg:inline">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>

    );
};

const SelectProduct = (props: Props) => {
    const [hasMore, setHasMore] = useState(true)
    const [totalHas, setTotalHas] = useState<number>(0)
    const handleFetch = useCallback(async (search: string) => {
        let resdata = await selectApi.get('', {
            params: search ? { search } : { limit: '20' }
        });
        let returnvalue: any[] = []
        if (resdata.success) {
            returnvalue = resdata?.payload?.products?.map((item: productType) => ({
                id: item.prod_id,
                label: item.prod_name,
                ...item
            })
            );
            const total_row = resdata.payload?.total_row ? Number(resdata.payload?.total_row) : 0;
            setTotalHas(total_row)
            setHasMore(resdata.payload?.hasMore)
        }
        return [...returnvalue];
    }, [])
    const handleFetchNext = useCallback(async (search: string, {
        options
    }: {
        options: OptionType[]
    }) => {
        if (totalHas <= options.length) return [];
        const resdata = await selectApi.get(``, {
            params: { search, skip: String(options.length || 0), limit: '20' }
        });
        let returnvalue: any[] = [];
        if (resdata.success) {
            returnvalue = resdata.payload?.products?.map((item: productType) => ({
                id: item.prod_id,
                label: item.prod_name,
                ...item
            }));
            const total_row = resdata.payload?.total_row ? Number(resdata.payload?.total_row) : 0;
            setTotalHas(total_row)
            setHasMore(resdata.payload?.hasMore)
        };
        return (returnvalue);
    }, []);


    return (
        <SelectCommandFetch
            ItemChildren={ItemChildren}
            onFetch={handleFetch}
            onFetchNext={handleFetchNext}
            onSelect={props.onSelected}
            name="product"
            placeholder="type (name/phone/..."
            selectLabel="--select product--"
            classNames={{
                triggerButton: 'purchesList input rounded-none text-xs line-clamp-1', //[&>svg]:hidden lg:[&>svg]:inline-block 
                popoverContent: 'overflow-auto w-40 md:w-44 lg:w-52'
            }}
            className={props.className}
            next_is="scroll"
            hasMore={hasMore}
            value={props.value}
            TriggerFirst={props.value?.id ? <ProductIcon /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 !inline">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>}
        />
    )
}

export default SelectProduct