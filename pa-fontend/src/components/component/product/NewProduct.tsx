import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  productPostAsync,
  productSlice,
  selectProducts,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputAdornment, Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Cross1Icon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "../../ui/button";
type productSchemaType = {
  prod_name: string;
  prod_type: string;
  price: string;
  uom: string;
  brand?: string;
  category?: string;
  bar_qr_code?: string;
};
const formSchema: z.ZodType<productSchemaType> = z.object({
  prod_name: z.string().min(1),
  prod_type: z.string(),
  price: z.string().refine((data) => /\d/.test(data), {
    message: "Invalid amount Number",
  }),
  uom: z.string(),
  brand: z.string().optional(),
  category: z.string().optional(),
  bar_qr_code: z.string().optional(),
});

const NewProduct = () => {
  // const [open, setOpen] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [isError, setIsError] = useState('')
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prod_name: "",
      bar_qr_code: "",
      brand: "",
      category: "",
      price: "0",
      prod_type: "",
      uom: "",
    },
  });
  const { new: newState } = useSelector(selectProducts);
  const handleCloseOpen = async () => {
    dispatch(productSlice.actions.setnewOpen(false));
  };
  const handleOpen = async () => {
    dispatch(productSlice.actions.setnewOpen(true));
  };
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      dispatch(
        productPostAsync({
          ...values,
          price: Number(values.price),
        })
      );
    } catch (error: any) {
      console.log({ error });
    }
  }

  return (
    <AlertDialog open={newState.open}>
      <Tooltip title="you can create alaways and update but not possible to delete anyway">
        <AlertDialogTrigger
          className={buttonVariants({ size: "sm" })}
          onClick={handleOpen}
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden md:inline">New Product</span>
        </AlertDialogTrigger>
      </Tooltip>
      <AlertDialogContent className="overflow-auto max-h-[75vh] text-foreground">
        {newState.isLoading && (
          <div className="w-full h-full absolute inset-0 animate-pulse bg-slate-500/30 bg-opacity-30 z-20 grid place-items-center">
            <div className="flex justify-center items-center">
              <ReloadIcon className="h-12 w-12 animate-spin" />
              {/* <TimerIcon className="h-12 w-12 pt-3 animate-bounce" /> */}
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AlertDialogHeader>
              <AlertDialogTitle>new product</AlertDialogTitle>
              <Button
                className="absolute right-2 top-0 w-10"
                type="button"
                size={"sm"}
                variant={"destructive"}
                onClick={handleCloseOpen}
              >
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
                      <TextField
                        size="small"
                        fullWidth
                        autoFocus
                        label="product name"
                        placeholder="product name"
                        {...field}
                        required
                      />
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
                      <TextField
                        size="small"
                        fullWidth
                        label="qr or bar code 'id'"
                        placeholder="qr or bar code 'id'"
                        {...field}
                      />
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
                        <TextField
                          size="small"
                          fullWidth
                          label="product type"
                          placeholder="product type"
                          {...field}
                          required
                        />
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
                        <TextField
                          size="small"
                          fullWidth
                          label="product price"
                          type="number"
                          placeholder="product price"
                          {...{
                            ...field,
                            onChange: (e) =>
                              field.onChange(
                                e.target.value.replace(/^0+(?=\d)/, "")
                              ),
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ৳:
                              </InputAdornment>
                            ),
                          }}
                          required
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
                      <TextField
                        size="small"
                        label="product brand"
                        placeholder="product brand"
                        {...field}
                      />
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
                        <TextField
                          size="small"
                          fullWidth
                          label="product uom"
                          placeholder="product uom"
                          {...field}
                          required
                        />
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
                        <TextField
                          size="small"
                          fullWidth
                          label="product category"
                          placeholder="product category"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {newState?.error && (
              <p className="text-red-500 text-right">{newState.error}</p>
            )}
            <AlertDialogFooter>
              <Button
                variant={"outline"}
                type="button"
                onClick={handleCloseOpen}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewProduct;
