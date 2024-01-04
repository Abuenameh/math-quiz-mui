import Link from "next/link";
import Image from "next/image";
import {currentUser, SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
// import {Button} from "@mui/material";
import Button from "@mui/material/Button";
import {NavItems} from "@/components/NavItems";
import {MobileNav} from "@/components/MobileNav";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import {useParams, useSearchParams} from "next/navigation";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {OurFileRouter} from "@/app/api/uploadthing/core";
import { UploadButton } from "@uploadthing/react";

export const Header = async () => {
    const user = await currentUser();
    const isPowerPoint = user?.publicMetadata.isPowerPoint as boolean || false;

    return (!isPowerPoint &&
        <header className={"w-full border-b"}>
            <div className={"wrapper flex items-center justify-between"}>
                <Link href={"/"} className={"flex-1"}>
                    <div className={"flex flex-row items-center"}>
                    <Image src={"/assets/icons/logo.svg"} width={38} height={38} alt={"logo"}/>
                    <Typography ml={2} fontSize={20} fontWeight={"bold"}>MathQuiz</Typography>
                    </div>
                </Link>

            <SignedIn>
                <nav className={"md:flex-between hidden w-full max-w-xs"}>
                    <NavItems />
                </nav>
            </SignedIn>

            <div className={"flex flex-1 w-32 justify-end gap-3"}>
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
