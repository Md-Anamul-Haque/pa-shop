import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { customerPutAsync, useDispatch } from "@/lib/redux";
import { customerType } from "@/types/tables.type";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
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
type Props = {
    customer: customerType;
    onSaveChange: (customer: customerType) => void;
    handleNext: () => void;
}
const EditFormCustomer = ({ customer, onSaveChange, handleNext }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setisError] = useState('')
    const [isSomeEdit, setisSomeEdit] = useState(false)

    const dispatch = useDispatch()

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
            if (!isSomeEdit) return;
            setIsLoading(true)
            const a = await dispatch(customerPutAsync({ ...values, cust_id: customer.cust_id }))
            onSaveChange(a.payload)
            setIsLoading(false)
            setisSomeEdit(false)
        } catch (error: any) {
            console.log({ error })
            setisError(error?.message || '')
        }
    }

    useEffect(() => {
        form.setValue('cust_name', customer?.cust_name || '')
        form.setValue('address', customer?.address || '')
        form.setValue('email', customer?.email || '')
        form.setValue('phone', customer?.phone || '')
    }, [customer]);
    return (
        <div className="text-foreground">
            {isLoading && <div className="w-full h-full absolute inset-0 animate-pulse bg-slate-500/30 bg-opacity-30 z-20 grid place-items-center">
                <div className="flex justify-center items-center">
                    <ReloadIcon className="h-12 w-12 animate-spin" />
                    {/* <TimerIcon className="h-12 w-12 pt-3 animate-bounce" /> */}
                </div>
            </div>}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="space-y-3 overflow-auto max-h-[65vh] py-5">
                        <small>{customer.cust_id}</small>
                        <FormField
                            control={form.control}
                            name="cust_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <TextField size="small" fullWidth autoFocus label="name" placeholder="customer name"
                                            {...{
                                                ...field, onChange: (e) => {
                                                    setisSomeEdit(true)
                                                    field.onChange(e)
                                                }
                                            }}
                                            required />
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
                                        <TextField size="small" fullWidth label="phone" placeholder="customer phone"
                                            {...{
                                                ...field, onChange: (e) => {
                                                    setisSomeEdit(true)
                                                    field.onChange(e)
                                                }
                                            }}
                                            required />
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
                                        <TextField size="small" fullWidth label="email" placeholder="customer email"
                                            {...{
                                                ...field, onChange: (e) => {
                                                    setisSomeEdit(true)
                                                    field.onChange(e)
                                                }
                                            }}
                                        />
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
                                        <TextField size="small" fullWidth label="address" placeholder="customer address"
                                            {...{
                                                ...field, onChange: (e) => {
                                                    setisSomeEdit(true)
                                                    field.onChange(e)
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {isError && <p className="text-red-500 text-right">{isError}</p>}
                    <div className="grid grid-cols-2 w-full">
                        {isSomeEdit ? <Button type="submit" size="small" variant="outlined" className="justify-self-start">SAVE CHANGE</Button> : <span></span>}
                        <Button type="button" size="small" variant="contained" className="justify-self-end" onClick={handleNext}>next</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditFormCustomer