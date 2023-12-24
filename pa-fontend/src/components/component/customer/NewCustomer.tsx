import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { customerPostAsync, customerSlice, selectCustomers, useDispatch, useSelector } from "@/lib/redux";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip } from "@mui/material";
import TextField from '@mui/material/TextField';
import { Cross1Icon, PersonIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "../../ui/button";
type customerSchemaType = {
    cust_name: string;
    address: string;
    phone: string;
    email?: string;
}
const formSchema: z.ZodType<customerSchemaType> = z.object({
    cust_name: z.string().min(1),
    address: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
});
type Props = {
    onNewSupplier?: (supplier: any) => void;
    triggerTextClass?: string;
}
const NewCustomer = ({ onNewSupplier, ...props }: Props) => {
    const dispatch = useDispatch()
    const newState = useSelector(selectCustomers).new;
    const { open, isLoading, error: isError } = newState
    const handleCloseOpen = async () => {
        dispatch(customerSlice.actions.setnewOpen(false))
    };
    const handleOpen = async () => {
        dispatch(customerSlice.actions.setnewOpen(true))
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cust_name: '',
            address: '',
            email: undefined,
            phone: ''
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            const newCust = await dispatch(customerPostAsync(values))
            onNewSupplier && onNewSupplier(newCust.payload)
            form.reset()
        } catch (error: any) {
            console.log({ error })
        }
    }

    return (
        <AlertDialog open={open}>
            <Tooltip title="you can create alaways and update but not possible to delete anyway">
                <AlertDialogTrigger className={buttonVariants({ size: 'sm', variant: "outline" })} onClick={handleOpen}>
                    <>
                        <PlusIcon className="h-5 w-5" />
                        <span className={cn("hidden md:inline-block", props.triggerTextClass)}>New customer</span>
                        {/* <span className="hidden md:inline-block" >New Customer</span> */}
                    </>
                </AlertDialogTrigger>
            </Tooltip>
            <AlertDialogContent className="overflow-auto max-h-[75vh] text-foreground">
                {isLoading && <div className="w-full h-full absolute inset-0 animate-pulse bg-slate-500/30 bg-opacity-30 z-20 grid place-items-center">
                    <div className="flex justify-center items-center">
                        <ReloadIcon className="h-12 w-12 animate-spin" />
                        {/* <TimerIcon className="h-12 w-12 pt-3 animate-bounce" /> */}
                    </div>
                </div>}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <AlertDialogHeader>
                            <AlertDialogTitle>new Customer  <PersonIcon className="inline" /></AlertDialogTitle>
                            <Button className="absolute right-2 top-0 w-10" type="button" size={'sm'} variant={"destructive"} onClick={handleCloseOpen}>
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
                        <p className="text-red-500 text-right">{isError}</p>
                        <AlertDialogFooter>
                            <Button variant={"outline"} type="button" onClick={handleCloseOpen}>
                                Cancel
                            </Button>
                            <Button type="submit">Create</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog >
    );
};

export default NewCustomer