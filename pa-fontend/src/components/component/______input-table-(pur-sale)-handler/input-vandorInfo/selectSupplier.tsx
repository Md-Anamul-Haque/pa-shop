import SelectCommandFetch, { Option as OptionType } from "@/components/lui/selectCommandFetch"
import ApiClient from "@/lib/ApiClient"
import { supplierType } from "@/types/tables.type"
import { FC, useCallback, useState } from "react"

type Props = {
    onSelected: (value: any) => void;
    className?: string
    value?: OptionType | string;
}
const selectApi = new ApiClient('/api/supplier')
const ItemChildren: FC<{ item: OptionType }> = ({ item }) => {
    return (
        <p className="w-full">
            {item.supp_name}
            <br />
            <small className="text-right w-full block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {item.address}
            </small>
        </p>
    )
};


const SelectSupplier = (props: Props) => {
    const [hasMore, setHasMore] = useState(true)
    const [totalHas, setTotalHas] = useState<number>(0)
    const handleFetch = useCallback(async (search: string) => {
        let resdata = await selectApi.get('', {
            params: search ? { search } : { limit: '20' }
        });
        let returnvalue: any[] = []
        if (resdata.success) {
            returnvalue = resdata?.payload?.supplier?.map((item: supplierType) => ({
                id: item.supp_id,
                label: item.supp_name,
                supp_id: item.supp_id,
                supp_name: item.supp_name,
                address: item.address,
                phone: item.phone,
                email: item.email,
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
            returnvalue = resdata.payload?.supplier?.map((item: supplierType) => ({
                id: item.supp_id,
                label: item.supp_name,
                supp_id: item.supp_id,
                supp_name: item.supp_name,
                address: item.address,
                phone: item.phone,
                email: item.email,
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
            name="supplier"
            placeholder="type (name/phone/..."
            selectLabel="select a supplier"
            classNames={{
                triggerButton: 'line-clamp-1',
                popoverContent: 'overflow-auto h-80'
            }}

            className={props.className}
            next_is="scroll"
            hasMore={hasMore}
            value={props.value}
            TriggerFirst={props.value ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>}
        />
    )
}

export default SelectSupplier