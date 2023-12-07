import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Tooltip } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import * as z from "zod";
import SelectSupplier from "./selectSupplier";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { selectPurchase, supplierPutAsync, useDispatch, useSelector } from "@/lib/redux";
import { supplierType } from "@/types/tables.type";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import NewSupplier from "../supplier/NewSupplier";
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
  onNext: (increment: number) => void;
  // supplier?: supplierType;
  onSaveChange: (supplier: supplierType) => void;
}
const PurchesVendorInfo_input = (props: Props) => {
  const { supplier: hasSupplier } = useSelector(selectPurchase);
  const [supplier, setSupplier] = useState<supplierType | undefined>(hasSupplier)

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setisError] = useState('')
  const [isSomeEdit, setisSomeEdit] = useState(false)

  const dispatch = useDispatch()

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
    if (supplier) {
      try {
        if (!isSomeEdit) return;
        setIsLoading(true)
        const { supp_id, supp_name, address, phone, email } = await (await dispatch(supplierPutAsync({ ...values, supp_id: supplier.supp_id }))).payload
        setSupplier({
          supp_id, supp_name, address, phone, email
        })
        // onSaveChange(a.payload)
        setIsLoading(false)
        setisSomeEdit(false)
      } catch (error: any) {
        console.log({ error })
        setisError(error?.message || '')
      }
    }
  }

  useEffect(() => {
    form.setValue('supp_name', supplier?.supp_name || '')
    form.setValue('address', supplier?.address || '')
    form.setValue('email', supplier?.email || '')
    form.setValue('phone', supplier?.phone || '')
  }, [supplier]);
  const isDisable = !supplier
  return (
    <div className="text-foreground grid justify-center space-y-2">
      {isLoading && <div className="w-full h-full absolute inset-0 animate-pulse bg-slate-500/30 bg-opacity-30 z-20 grid place-items-center">
        <div className="flex justify-center items-center">
          <ReloadIcon className="h-12 w-12 animate-spin" />
          {/* <TimerIcon className="h-12 w-12 pt-3 animate-bounce" /> */}
        </div>
      </div>}
      {/* <div className="ml-auto">
        <NewSupplier triggerTextClass="inline-block" onNewSupplier={(supp) => {
          console.log({ supp })
          setSupplier(supp)
        }} />
      </div> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid justify-center space-y-2">
          <div className="grid gap-3 w-full">
            <div className="flex flex-wrap items-center space-x-3">
              <SelectSupplier
                onSelected={(sup: supplierType) => {
                  if (sup) {
                    const { supp_id, supp_name, address, phone, email } = sup
                    setSupplier({
                      supp_id, supp_name, address, phone, email
                    })
                  } else {
                    setSupplier(undefined)
                  }
                }}
                value={{
                  id: supplier?.supp_id || '',
                  label: supplier?.supp_name || ''
                }}
              />
              <div >
                <p className="mx-2 text-sm inline-block">{supplier?.supp_id || ''}</p>

                <Button disabled={!isSomeEdit} onClick={() => {
                  form.setValue('supp_name', supplier?.supp_name || '')
                  form.setValue('address', supplier?.address || '')
                  form.setValue('email', supplier?.email || '')
                  form.setValue('phone', supplier?.phone || '')
                  setisSomeEdit(false)
                }}>
                  <Tooltip title="undo/resat">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </Tooltip>
                </Button>
                <Button disabled={isDisable} onClick={() => {
                  setSupplier(undefined)
                  setisSomeEdit(false)
                }}>
                  <Tooltip title="clear">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </Tooltip>
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
              name="supp_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextField size="small" fullWidth autoFocus={!isDisable} label="name" placeholder="supplier name"
                      {...{
                        ...field, onChange: (e) => {
                          setisSomeEdit(true)
                          field.onChange(e)
                        }
                      }}
                      disabled={isDisable}
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
                    <TextField size="small" fullWidth label="phone" placeholder="supplier phone"
                      {...{
                        ...field, onChange: (e) => {
                          setisSomeEdit(true)
                          field.onChange(e)
                        }
                      }}
                      disabled={isDisable}
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
                    <TextField size="small" fullWidth label="email" placeholder="supplier email"
                      {...{
                        ...field, onChange: (e) => {
                          setisSomeEdit(true)
                          field.onChange(e)
                        }
                      }}
                      disabled={isDisable}
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
                    <TextField size="small" fullWidth label="address" placeholder="supplier address"
                      {...{
                        ...field, onChange: (e) => {
                          setisSomeEdit(true)
                          field.onChange(e)
                        }
                      }}
                      disabled={isDisable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isError && <p className="text-red-500 text-right">{isError}</p>}
          <div className="grid grid-cols-2">
            {isSomeEdit ? <Button type="submit" size="small" variant="outlined">SAVE CHANGE</Button> : <span></span>}
            <Button type="button" size="small" onClick={() => {
              props.onNext(1)
              supplier?.supp_id && props.onSaveChange(supplier)
            }} variant="contained" disabled={!supplier?.supp_id} className="justify-self-end">Next</Button>
          </div>
          <hr />
        </form>
        <NewSupplier triggerTextClass="inline-block" onNewSupplier={(supp) => {
          console.log({ supp })
          setSupplier(supp)
        }} />
      </Form>
    </div>
  );
};

export default PurchesVendorInfo_input