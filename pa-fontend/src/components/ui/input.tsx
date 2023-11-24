import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {
    if (label) {
      return (
        <div className="relative">
          <input
            type={type}
            className={cn(
              "peer flex h-9 w-full placeholder:opacity-0 focus-visible:placeholder:opacity-100 text-foreground rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          <Label className="absolute duration-300 transform -translate-y-4 scale-85 top-2 z-10 origin-[0] opacity-50 bg-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:opacity-100 left-1">
            {label}
          </Label>
        </div>
      )
    }
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input };

// import * as React from "react";

// import { cn } from "@/lib/utils";
// import { Label } from "./label";

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, label, placeholder, ...props }, ref) => {
//   return (
// <div className="relative h-10 w-full">
//   <input
//     type={type}
//     className={cn(
//       "peer flex h-10 w-full placeholder:opacity-0 focus-visible:placeholder:opacity-100 transition-all duration-300 delay-75 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//       className
//     )}
//     ref={ref}
//     // value={value}
//     placeholder={placeholder}
//     {...props}
//   />
//   {label && <Label className="absolute duration-300 transform -translate-y-4 scale-85 top-2 z-10 origin-[0] opacity-50 bg-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:opacity-100 left-1">
//     {label}
//   </Label>}
// </div>
//   )
// }
// )
// Input.displayName = "Input"

// export { Input };