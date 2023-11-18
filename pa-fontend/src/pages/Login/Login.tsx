import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const Login = () => {
    return (
        <Card className="w-full sm:w-80 block mx-auto mt-10 space-y-5 container py-8">
            <Input placeholder="username/email" />
            <Input placeholder="password" type="password" />
            <Button>Login</Button>
        </Card>
    )
}

export default Login