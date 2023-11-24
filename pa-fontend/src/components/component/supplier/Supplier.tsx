import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { supplierSlice, useDispatch } from "@/lib/redux"
import { supplierType } from "@/types/tables.type"
import { FC } from "react"
import { useSearchParams } from "react-router-dom"

export const SupplierCard: FC<{ supplier: supplierType }> = ({ supplier }) => {
    const dispatch = useDispatch()
    let [_searchParams, setSearchParams] = useSearchParams();

    const handleEdit = () => {
        dispatch(supplierSlice.actions.setEdiable({ supp_id: supplier.supp_id! }));
        setSearchParams({ edit: supplier.supp_id! }, {
            replace: true
        })
    }
    return (
        <Card className="bg-background pb-6 relative rounded-md overflow-hidden shadow-md w-40 sm:w-44 inline-block">
            {/* <img className="w-auto mx-auto h-24 object-cover object-center" src="vite.svg" alt="Supplier" /> */}
            <Avatar className="w-auto mx-auto h-24 object-cover object-center">
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                <AvatarFallback className="text-4xl font-black font-mono">
                    {supplier?.supp_name?.substring(0, 1)}
                </AvatarFallback>
            </Avatar>
            <div className="p-4">
                <div className="font-bold text-lg mb-2">{supplier.supp_name}</div>
                <div className=" flex text-sm">
                    {/* <p className="font-sans">
                        address
                    </p>
                    : &nbsp; */}
                    <p className="font-mono">
                        {supplier.address}
                    </p>
                </div>
                <div className=" flex text-sm">
                    <p>{supplier?.phone ? 'phone' : 'email'}</p>: &nbsp; <p>{supplier?.phone || supplier?.email}</p>
                </div>
            </div>
            <Button size={'sm'} className="absolute left-0 bottom-0" variant={"default"} onClick={handleEdit}>
                edit
            </Button>
            {/* <div className="p-4">
                <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">#Quality</span>
                <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">#Reliable</span>
            </div> */}
        </Card>

    )
}
