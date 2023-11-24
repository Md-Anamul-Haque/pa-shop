import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ApiClient from "@/lib/ApiClient"
import { apiResponceType } from "@/types/apiResponceType"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(18)
})
const loginApi = new ApiClient('/api/auth/login')
function Login() {
    const [isLoading, setIsLoading] = useState(true);
    const navigator = useNavigate()
    useEffect(() => {
        loginApi.get().then((data: apiResponceType) => {
            console.log({ data })
            if (data?.success) {
                navigator('/', {
                    replace: true
                })
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }, []);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ''
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        console.log(values)
        const data: apiResponceType = await loginApi.post('', {
            data: values,
            withToast: true
        })
        console.log(data)
        if (!data.success) {
            setIsLoading(false)
        } else {
            navigator('/')
        }
    };
    return (
        <main className="container grid place-items-center">
            <Card className="w-full max-w-sm container py-10 ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username/email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button isLoading={isLoading} size="lg"
                            onClick={() => { }}
                            className="w-full"
                        >login</Button>
                    </form>
                </Form>
            </Card>
        </main>
    )
}

export default Login