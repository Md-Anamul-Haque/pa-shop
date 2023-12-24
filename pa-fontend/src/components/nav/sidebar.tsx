import { NavLink } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Card } from "@mui/material";
import { AvatarIcon, CookieIcon, CountdownTimerIcon, HomeIcon, PersonIcon, PlusIcon } from "@radix-ui/react-icons";

function Sidebar({ open }: { open: boolean }) {

    return (
        <Card style={{
            boxShadow: '10px 1px 5px #43485244'
        }} className={cn("transition-all duration-300 sticky left-0 top-10 -translate-x-full ease-in h-[calc(100vh-40px)] w-56", open ? '-translate-x-0 mr-5' : 'w-0')}>
            <nav className={"w-full h-full"}>
                <NavLink className={cn(buttonVariants({ variant: "link", className: 'w-full h-fit' }), 'justify-start')}
                    to={'/'}>
                    <HomeIcon className="w-5 h-5 mr-3" /> Home
                </NavLink>

                <NavLink className={cn(buttonVariants({ variant: "link", className: 'w-full h-fit' }), 'justify-start')}
                    to={'/product'}>
                    <CookieIcon className="w-5 h-5 mr-3" /> product
                </NavLink>
                <NavLink className={cn(buttonVariants({ variant: "link", className: 'w-full h-fit' }), 'justify-start')}
                    to={'/supplier'}>
                    <PersonIcon className="w-5 h-5 mr-3" /> supplier
                </NavLink>
                <NavLink className={cn(buttonVariants({ variant: "link", className: 'w-full h-fit' }), 'justify-start')}
                    to={'/customer'}>
                    <AvatarIcon className="w-5 h-5 mr-3" /> customer
                </NavLink>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className={buttonVariants({ variant: "outline", className: 'btn flex justify-between mr-auto w-full h-fit' })} >purchase</AccordionTrigger>
                        <AccordionContent className="grid grid-cols-1 justify-start text-left shadow-lg pl-4">
                            <NavLink className={cn(buttonVariants({ variant: "link" }), 'justify-start')} to={'/purchase'}><PlusIcon className="w-5 h-5 mr-3" /> new Purchase</NavLink>
                            <NavLink className={cn(buttonVariants({ variant: "link" }), 'justify-start')} to={'/purchase/list'}> <CountdownTimerIcon className="w-5 h-5 mr-3" /> History of purchase</NavLink>
                            <NavLink className={cn(buttonVariants({ variant: "link" }), 'justify-start')} to={'/purchase/return'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                                </svg>
                                return purchase</NavLink>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className={buttonVariants({ variant: "outline", className: 'btn flex justify-between mr-auto w-full h-fit' })} >Sales</AccordionTrigger>
                        <AccordionContent className="grid grid-cols-1 justify-start text-left shadow-lg pl-4">
                            <NavLink className={cn(buttonVariants({ variant: "link" }), 'justify-start')} to={'/sales'}><PlusIcon className="w-5 h-5 mr-3" />new Sales</NavLink>
                            <NavLink className={cn(buttonVariants({ variant: "link" }), 'justify-start')} to={'/sales/list'}> <CountdownTimerIcon className="w-5 h-5 mr-3" /> History of Sales</NavLink>
                            <NavLink className={cn(buttonVariants({ variant: "link" }), 'justify-start')} to={'/sales/return'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                </svg>
                                return Sales</NavLink>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
                <NavLink className={cn(buttonVariants({ variant: "link", className: 'w-full h-fit' }), 'justify-start')}
                    to={'/user'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    Users
                </NavLink>

            </nav>
        </Card>
    );
}

export default Sidebar;