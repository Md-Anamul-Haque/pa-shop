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
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { customerPutAsync, customerSlice, selectCustomers, useDispatch, useSelector } from "@/lib/redux";
import { Cross1Icon, PersonIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
type customerSchemaType = {
    cust_name: string;
    address: string;
    phone: string;
    email?: string;
};
const formSchema: z.ZodType<customerSchemaType> = z.object({
    cust_name: z.string().min(1),
    address: z.string(),
    phone: z.string(),
    email: z.string().email(),
});
const EditCustomer = () => {
    // const navigator = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    let params: any = {};
    searchParams.forEach((value, key) => {
        params = { ...params, [key]: value };
    });
    // alert(JSON.stringify(params))
    const { update: updateState } = useSelector(selectCustomers);
    const editIngCustomer = updateState.customer;
    const dispatch = useDispatch()
    const handleCLoseEditing = async () => {
        dispatch(customerSlice.actions.closeEdiable())
        delete params.edit;
        setSearchParams({
            ...params,
        }, {
            replace: true
        })
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cust_name: '',
            address: '',
            email: '',
            phone: ''
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            await dispatch(customerPutAsync({ ...values, cust_id: editIngCustomer?.cust_id }))
            setSearchParams({
                // edit:
            })
        } catch (error) {
            console.log({ error })
        }
    }

    useEffect(() => {
        form.setValue('cust_name', editIngCustomer?.cust_name || '')
        form.setValue('address', editIngCustomer?.address || '')
        form.setValue('email', editIngCustomer?.email || '')
        form.setValue('phone', editIngCustomer?.phone || '')
    }, [editIngCustomer]);
    return (
        <AlertDialog open={!!editIngCustomer?.cust_id}>
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
                            <AlertDialogTitle>update customer <PersonIcon className="inline" /> </AlertDialogTitle>
                            <Button className="absolute right-2 top-0 w-10" type="button" size={'sm'} variant={"destructive"} onClick={handleCLoseEditing}>
                                <Cross1Icon />
                            </Button>
                        </AlertDialogHeader>
                        <div className="space-y-5 md:gap-6">
                            <FormField
                                control={form.control}
                                name="cust_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" fullWidth autoFocus label="name" placeholder="customer name" {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" fullWidth label="phone" placeholder=" phone" {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" fullWidth label="email" placeholder=" email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" fullWidth label="address" placeholder=" address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {updateState?.error && <p className="text-red-500 text-right">{updateState.error}</p>}
                        <AlertDialogFooter >
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

export default EditCustomer