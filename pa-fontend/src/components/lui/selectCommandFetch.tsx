import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react"
export type Option = {
    // value: string;
    label: string;
    id: string;
} & Record<string, any>

const FetchNextHandler = ({ handleFetch, next_is }: { handleFetch: () => Promise<any>; next_is?: ('button' | 'scroll') }) => {
    const f_ref = useRef<HTMLDivElement>(null);
    const [isFetchIng, setIsFetching] = useState(false)
    const [IsHost, setIsHost] = useState<boolean>(false);
    const handleFetching = useCallback(async () => {
        if (isFetchIng || IsHost) return;
        setIsHost(true)
        setTimeout(() => {
            setIsHost(false)
        }, 600);
        console.log('trigaur in handlefetching')
        setIsFetching(true)
        await handleFetch();
        setIsFetching(false)
    }, [handleFetch])
    useEffect(() => {
        if (!f_ref.current) return
        let options: IntersectionObserverInit = {
            threshold: 0.81,
        };
        const callback: IntersectionObserverCallback = async (item) => {
            if (item?.[0]?.isIntersecting) {
                handleFetching()
            }
        }
        let observer = new IntersectionObserver(callback, options);
        observer.observe(f_ref.current);
    }, [f_ref.current])
    if (next_is === 'button') {
        return (<Button
            disabled={isFetchIng}
            variant="outline"
            className="w-full"
            onClick={handleFetching}
        >
            {isFetchIng ? 'Loading More...' : 'Load More'}
        </Button>)
    } else {
        return (
            <div ref={f_ref} className="flex text-center font-thin font-mono w-full opacity-50 animate-bounce items-center justify-center">
                {isFetchIng ? 'fetching More...' : 'More 🤔'}
            </div>
        )
    }


}
export type Props = {
    onFetch?: (searchValue: string) => Promise<Option[]>;
    onFetchNext?: (searchValue: string, { options }: {
        options: Option[];
    }) => Promise<Option[]>;
    onSelect?: (selectedOption: any) => any;
    className?: string;
    classNames?: {
        popoverContent?: string;
        command?: string;
        input?: string;
        commandGroup?: string;
        commandItem?: string;
        triggerButton?: string;
    }
    value?: (string | Option);
    placeholder?: string;
    next_is?: ('button' | 'scroll');
    next_is_button_children?: string;
    name?: string;
    selectLabel?: ReactNode;
    loading_text?: string;
    onInputChange?: (value: string) => void;
    ItemChildren?: FC<{
        item: Option;
    }>;
    hasMore?: boolean;
    TriggerFirst?: ReactNode;
};




const ItemChildrenDefault: FC<{ item: Option }> = ({ item }) => {
    return (
        <div>{item.label}</div>
    )
}


const SelectCommandFetch = ({ hasMore = true, ...props }: Props) => {
    const ItemChildren = props.ItemChildren || ItemChildrenDefault;
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<Option>({
        id: '',
        label: ''
    })
    const [options, setOptions] = useState<Option[]>([])
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
        null
    );
    const findoption = (value: string): Option | undefined => {
        return options && options.find((option) => option.id == value.toUpperCase());
    };
    useEffect(() => {
        if (typeof (props?.value) == 'string') {
            setValue(findoption(props.value) || {
                id: '',
                label: ''
            })
        } else {
            setValue({
                id: '',
                label: ''
                , ...props.value
            })
        }
    }, [props.value])

    const fetchoptions = useCallback(async () => {
        setLoading(true);
        try {
            props.onFetch && setOptions(await props.onFetch(searchValue) || []);
        } catch (error) {
            console.error(`Error ${props.name || 'fetching options'}:`, error);
        } finally {
            setLoading(false);
        }
    }, [props.onFetch, ItemChildren])
    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        // Set a new timeout
        setTypingTimeout(
            setTimeout(() => {
                // Fetch data after 1000ms
                if (open && (searchValue.trim() !== '' || !options.length)) {
                    fetchoptions();
                }
            }, 400)
        );
    }, [open, searchValue]);
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    const handleSelectOption = (selectedOption: Option) => {
        if (value.id === selectedOption.id) {
            props.onSelect && props.onSelect(undefined)
            setValue({
                id: '',
                label: ''
            });
        } else {
            props.onSelect && props.onSelect(selectedOption)
            setValue(selectedOption);
        }
        setOpen(false);
    };

    const handleInputChange = (inputValue: string) => {
        // Update the searchValue and trigger data refetch
        props.onInputChange && props.onInputChange(inputValue);
        setSearchValue(inputValue);
    };

    return (
        <div className={cn('w-[200px]', props.className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger className="w-full" asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between", props.classNames?.triggerButton)}
                    >

                        {props?.TriggerFirst && props.TriggerFirst} {value.id
                            ? value.label //findoption(value)?.label
                            : props.selectLabel || "Select..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("w-full p-0 ", props?.classNames?.popoverContent)}>
                    <Command
                        filter={(value, search) => {
                            const regexp = new RegExp(search, 'i')
                            if (regexp.test(value)) return 1
                            return 0
                        }} className={props.classNames?.command}>
                        <CommandInput autoFocus onValueChange={handleInputChange} placeholder={props.placeholder || "Search..."} className={cn("h-9", props.classNames?.input)} />
                        {loading && <CommandEmpty>{props.loading_text || 'Loading...'}</CommandEmpty>}
                        {!loading && !options.length && <CommandEmpty>No {props.name || 'options'} found.</CommandEmpty>}
                        <CommandGroup className={cn('overflow-auto max-h-[50vh]', props.classNames?.commandGroup)}>
                            {options && options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={Object.values(option).join(',') || ''}
                                    // value={Object.entries(option).join('&&&').replace(/,/g, ':').replace(/&&&/g, ',') || ''}
                                    onSelect={() => handleSelectOption(option)}
                                    className={cn("border", props.classNames?.commandItem)}
                                >
                                    <ItemChildren item={option} />
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value.id === (option.id || '') ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                            {hasMore && <CommandItem className={cn("border FetchNextContainer", props.classNames?.commandItem)}>
                                <FetchNextHandler next_is={props.next_is} handleFetch={() => new Promise((resolve, reject) => {
                                    props.onFetchNext && hasMore && props.onFetchNext(searchValue, {
                                        options
                                    }).then(data => {
                                        setOptions(options => options.concat(data))
                                        resolve(data)
                                    }).catch(err => reject(err))
                                    console.log('fetching...')
                                })} />
                            </CommandItem>}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default SelectCommandFetch