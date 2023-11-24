import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../ui/button";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { productPutAsync, productSlice, selectProducts, useDispatch, useSelector } from "@/lib/redux";
import { InputAdornment } from "@mui/material";
import { Cross1Icon, ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
type productSchemaType = {
    prod_name: string;
    prod_type: string;
    price: number;
    uom: string;
    brand?: string;
    category?: string;
    bar_qr_code?: string;
}
const formSchema: z.ZodType<productSchemaType> = z.object({
    prod_name: z.string(),
    prod_type: z.string(),
    price: z.number(),
    uom: z.string(),
    brand: z.string().optional(),
    category: z.string().optional(),
    bar_qr_code: z.string().optional(),
});
const EditProduct = () => {
    // const navigator = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    let params: any = {};
    searchParams.forEach((value, key) => {
        params = { ...params, [key]: value };
    });
    const { update: updateState } = useSelector(selectProducts);
    const editIngProduct = updateState.product;
    const dispatch = useDispatch()
    const handleCLoseEditing = async () => {
        dispatch(productSlice.actions.closeEdiable())
        delete params.edit;
        setSearchParams({
            params
        })
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prod_name: '',
            bar_qr_code: '',
            brand: '',
            category: '',
            price: 0,
            prod_type: '',
            uom: ''
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            await dispatch(productPutAsync({ ...values, prod_id: editIngProduct?.prod_id }))
            setSearchParams({
                // edit:
            }, {
                replace: true
            })
        } catch (error) {
            console.log({ error })
        }
    }
    useEffect(() => {
        form.setValue('prod_name', editIngProduct?.prod_name || '')
        form.setValue('bar_qr_code', editIngProduct?.bar_qr_code || '')
        form.setValue('brand', editIngProduct?.brand || '')
        form.setValue('category', editIngProduct?.category || '')
        form.setValue('price', Number(editIngProduct?.price) || 0)
        form.setValue('prod_type', editIngProduct?.prod_type || '')
        form.setValue('uom', editIngProduct?.uom || '')
    }, [editIngProduct]);
    return (
        <AlertDialog open={!!editIngProduct?.prod_id}>
            {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
            <AlertDialogContent className="overflow-auto max-h-[75vh] text-foreground">
                {updateState?.isLoading && <div className="w-full h-full absolute inset-0 animate-pulse bg-slate-500/30 bg-opacity-30 z-20 grid place-items-center">
                    <div className="flex justify-center items-center">
                        <ReloadIcon className="h-12 w-12 animate-spin" />
                        {/* <TimerIcon className="h-12 w-12 pt-3 animate-bounce" /> */}
                    </div>
                </div>}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <AlertDialogHeader>
                            <AlertDialogTitle>update product</AlertDialogTitle>
                            <Button className="absolute right-2 top-0 w-10" type="button" size={'sm'} variant={"destructive"} onClick={handleCLoseEditing}>
                                <Cross1Icon />
                            </Button>
                        </AlertDialogHeader>
                        <div className="space-y-5 md:gap-6">

                            <FormField
                                control={form.control}
                                name="prod_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" fullWidth autoFocus label="product name" placeholder="product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bar_qr_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" fullWidth label="qr or bar code 'id'" placeholder="qr or bar code 'id'" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your product qr or bar code id.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex ">
                                <FormField
                                    control={form.control}
                                    name="prod_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <TextField size="small" fullWidth label="product type" placeholder="product type" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                {/* <TextField
                                                    id="input-with-icon-textfield"
                                                    label="TextField"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AccountCircle />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    variant="standard"
                                                /> */}
                                                <TextField size="small" fullWidth label="product price" type="number" placeholder="product price"
                                                    {...{ ...field, onChange: e => field.onChange(Number(e.target.value.replace(/^0+(?=\d)/, ''))) }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                ৳:
                                                            </InputAdornment>
                                                        ),
                                                    }}

                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This is your product sells price.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" label="product brand" placeholder="product brand" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="uom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <TextField size="small" fullWidth label="product uom" placeholder="product uom" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <TextField size="small" fullWidth label="product category" placeholder="product category" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                        </div>
                        {updateState?.error && <p className="text-red-500 text-right">{updateState.error}</p>}
                        <AlertDialogFooter>
                            <Button variant={"outline"} type="button" onClick={handleCLoseEditing}>
                                Cancel
                            </Button>
                            <Button type="submit">SAVE CHANGE</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EditProduct