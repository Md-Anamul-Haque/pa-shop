import { buttonVariants } from "./components/ui/button";

export default function NotFound() {

  return (
    <div id="error-page" className="min-h-screen flex flex-col items-center justify-center h-scree">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-lg mb-2">Sorry, an unexpected error has occurred. </p>
      <p className="tracking-widest text-gray-500 uppercase">404 | not Found</p>
      <a href="/" className={buttonVariants({ className: 'underline mt-5', variant: "outline" })}>Go to Home</a>
    </div>
  );
}
