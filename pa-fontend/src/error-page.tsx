import { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";
import { buttonVariants } from "./components/ui/button";

export default function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error] = useState<any>(useRouteError());
  useEffect(() => {
    console.log(error)
  }, [error]);
  return (
    <div id="error-page" className="min-h-screen flex flex-col items-center justify-center h-scree">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-lg mb-2">Sorry, an unexpected error has occurred.  {error?.error?.message || error?.data || ''} </p>
      <p className="tracking-widest text-gray-500 uppercase">{error?.status || ''} | {error?.statusText || error?.message || ''}</p>
      <a href="/" className={buttonVariants({ className: 'underline mt-5', variant: "outline" })}>Go to Home</a>
    </div>
  );
}
