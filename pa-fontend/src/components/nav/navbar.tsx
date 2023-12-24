import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

function Navbar({ setOpenSidebar }: {
    setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <div className="sticky flex overflow-y-hidden items-center gap-x-3 px-3 inset-0 w-full h-10 shadow-xl bg-pink-700">
            <Button className="h-8 w-8" size={'icon'} onClick={() => setOpenSidebar(p => !p)}>
                <HamburgerMenuIcon />
            </Button>
        </div>
    );
}

export default Navbar;