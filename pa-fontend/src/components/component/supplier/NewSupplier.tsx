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
import { selectSuppliers, supplierPostAsync, supplierSlice, useDispatch, useSelector } from "@/lib/redux";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip } from "@mui/material";
import TextField from '@mui/material/TextField';
import { Cross1Icon, PersonIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "../../ui/button";
type supplierSchemaType = {
    supp_name: string;
    address: string;
    phone: string;
    email?: string;
}
const formSchema: z.ZodType<supplierSchemaType> = z.object({
    supp_name: z.string().min(1),
    address: z.string(),
    phone: z.string(),
    email: z.string().email(),
});

type Props = {
    onNewSupplier?: (supplier: any) => void;
    triggerTextClass?: string;
}
const NewSupplier = ({ onNewSupplier, ...props }: Props) => {
    const dispatch = useDispatch()
    const newState = useSelector(selectSuppliers).new;
    const { open, isLoading, error: isError } = newState
    const handleCloseOpen = async () => {
        dispatch(supplierSlice.actions.setnewOpen(false))
    };
    const handleOpen = async () => {
        dispatch(supplierSlice.actions.setnewOpen(true))
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supp_name: '',
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
            const newsup = await dispatch(supplierPostAsync(values));
            console.log({ newsup })
            onNewSupplier && onNewSupplier(newsup.payload)
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
                        <span className={cn("hidden md:inline-block", props.triggerTextClass)}>New Supplier</span>
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
                            <AlertDialogTitle>new supplier  <PersonIcon className="inline" /></AlertDialogTitle>
                            <Button className="absolute right-2 top-0 w-10" type="button" size={'sm'} variant={"destructive"} onClick={handleCloseOpen}>
                                <Cross1Icon />
                            </Button>
                        </AlertDialogHeader>
                        <div className="space-y-5 md:gap-6">

                            <FormField
                                control={form.control}
                                name="supp_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TextField size="small" fullWidth autoFocus label="name" placeholder="supplier name" {...field} required />
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
                                            <TextField size="small" fullWidth label="phone" placeholder="supplier phone" {...field} required />
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
                                            <TextField size="small" fullWidth label="email" placeholder="supplier email" {...field} />
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
                                            <TextField size="small" fullWidth label="address" placeholder="supplier address" {...field} />
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

export default NewSupplier