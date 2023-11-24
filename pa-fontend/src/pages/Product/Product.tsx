import EditProduct from "@/components/component/product/EditProduct";
import FilterProduct from "@/components/component/product/FilterProduct";
import NewProduct from "@/components/component/product/NewProduct";
import ProductCard from "@/components/component/product/product";
import { Card } from "@/components/ui/card";
import { productGetAsync, selectProducts, useDispatch, useSelector } from "@/lib/redux";
import { Typography } from "@mui/material";
import { useEffect } from "react";

const Products = () => {
    const dispatch = useDispatch()
    const { data: products, isLoading, error: isError } = useSelector(selectProducts)
    useEffect(() => {
        dispatch(productGetAsync({}))
    }, [dispatch])
    return (
        <main className="px-2 bg-background">
            <Card className="flex p-1 max-w-3xl mx-auto rounded-none justify-between">
                <FilterProduct />
                <NewProduct />
            </Card>
            <div className="p-4 mx-auto block">
                {isError && <p>{isError}</p>}
                {isLoading && <Typography component={"h2"} variant="h2" className="animate-pulse text-foreground">Loading...</Typography>}
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
                {products && products.map((product) => {
                    return (
                        <ProductCard product={product} key={product.prod_id} />
                    );
                })}
            </div>
            <EditProduct />
        </main>
    );
};

export default Products