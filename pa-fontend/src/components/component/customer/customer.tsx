import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { customerSlice, useDispatch } from "@/lib/redux"
import { customerType } from "@/types/tables.type"
import { FC } from "react"
import { useSearchParams } from "react-router-dom"

export const CustomerCard: FC<{ customer: customerType }> = ({ customer }) => {
    const dispatch = useDispatch()
    let [_searchParams, setSearchParams] = useSearchParams();

    const handleEdit = () => {
        dispatch(customerSlice.actions.setEdiable({ supp_id: customer.cust_id! }));
        setSearchParams({ edit: customer.cust_id! }, {
            replace: true
        })
    }
    return (
        <Card className="bg-background pb-6 relative rounded-md overflow-hidden shadow-md w-40 sm:w-44 inline-block">
            {/* <img className="w-auto mx-auto h-24 object-cover object-center" src="vite.svg" alt="Supplier" /> */}
            <Avatar className="w-auto mx-auto h-24 object-cover object-center">
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                <AvatarFallback className="text-4xl font-black font-mono">
                    {customer?.cust_name?.substring(0, 1)}
                </AvatarFallback>
            </Avatar>
            <div className="p-4">
                <div className="font-bold text-lg mb-2">{customer.cust_name}</div>
                <div className=" flex text-sm">
                    {/* <p className="font-sans">
                        address
                    </p>
                    : &nbsp; */}
                    <p className="font-mono">
                        {customer.address}
                    </p>
                </div>
                <div className=" flex text-sm">
                    <p>{customer?.phone ? 'phone' : 'email'}</p>: &nbsp; <p>{customer?.phone || customer?.email}</p>
                </div>
            </div>
            <Button size={'sm'} className="absolute left-0 bottom-0" variant={"default"} onClick={handleEdit}>
                edit
            </Button>

        </Card>

    )
}
