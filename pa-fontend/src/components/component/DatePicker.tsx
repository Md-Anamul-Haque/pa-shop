import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export function DatePicker({ onSelect, value }: { onSelect?: (date: Date | undefined) => any; value?: Date }) {
    const [date, setDate] = useState<Date | undefined>(value || new Date())
    const handleChange = (d?: Date) => {
        onSelect && onSelect(d)
        setDate(d)
    }
    useEffect(() => {
        setDate(value)
    }, [value])
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}