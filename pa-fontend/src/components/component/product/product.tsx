import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { productSlice, useDispatch } from "@/lib/redux";
import { productType } from "@/types/tables.type";
import { Card } from "@mui/material";
import { useSearchParams } from "react-router-dom";
interface ProductCardProps {
    product: productType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { category, prod_name, price, prod_id } = product;
    const dispatch = useDispatch()
    let [_searchParams, setSearchParams] = useSearchParams();

    const handleEdit = () => {
        dispatch(productSlice.actions.setEdiable({ prod_id }));
        setSearchParams({ edit: prod_id! }, {
            replace: true
        })
    }
    return (
        <Card className="w-40 sm:w-44 h-60 border flex-col justify-center items-center inline-flex">
            <div className="relative w-full h-full">
                <div className="absolute left-8 top-28 w-28 h-1">
                    <div className="absolute w-12 h-1 left-0 top-0 bg-black bg-opacity-10 rounded-full blur-[4.57px]" />
                    <div className="absolute w-12 h-1 left-16 top-0 bg-black bg-opacity-10 rounded-full blur-[4.57px]" />
                </div>
                <div className="absolute left-4 top-36 w-28 h-16 flex-col justify-start items-start inline-flex">
                    <div className=" text-opacity-60 text-xs font-medium font-Poppins">{category}</div>
                    <div className=" text-sm font-bold font-Poppins">{prod_name}</div>
                    <div className=" text-opacity-60 font-mono text-sm font-medium font-Poppins">৳: {price}</div>
                </div>
                <Avatar className="absolute w-32 h-20 left-1/2 -translate-x-1/2 top-4">
                    {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                    <AvatarFallback className="text-4xl font-black font-mono">
                        {prod_name.substring(0, 1)}
                    </AvatarFallback>
                </Avatar>
                <Button size={'sm'} className="float-right" variant={"default"} onClick={handleEdit}>
                    edit
                </Button>
                {/* <img className="absolute w-32 h-20 left-1/2 -translate-x-1/2 top-3" src={'productBg'} alt="Product Image" /> */}
            </div>
        </Card>

    )
}

export default ProductCard