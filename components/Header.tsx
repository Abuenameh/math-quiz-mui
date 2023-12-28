import Link from "next/link";
import Image from "next/image";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
// import {Button} from "@mui/material";
import Button from "@mui/material/Button";
import {NavItems} from "@/components/NavItems";
import {MobileNav} from "@/components/MobileNav";

export const Header = () => {
    return (
        <header className={"w-full border-b"}>
            <div className={"wrapper flex items-center justify-between"}>
                <Link href={"/"} className={"w-36"}>
                    <Image src={"/assets/icons/logo.svg"} width={38} height={38} alt={"logo"}/>
                </Link>

            <SignedIn>
                <nav className={"md:flex-between hidden w-full max-w-xs"}>
                    <NavItems />
                </nav>
            </SignedIn>

            <div className={"flex w-32 justify-end gap-3"}>
                <SignedIn>
                    <UserButton afterSignOutUrl={"/"} />
                    <MobileNav />
                </SignedIn>
                <SignedOut>
                    <Button variant={"contained"}>
                        <Link href={"/sign-in"}>Login</Link>
                    </Button>
                </SignedOut>
            </div>
            </div>
        </header>
    );
};
