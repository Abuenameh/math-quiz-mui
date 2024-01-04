import Link from "next/link";
import Image from "next/image";
import {currentUser} from "@clerk/nextjs";

export const Footer = async () => {
    const user = await currentUser();
    const isPowerPoint = user?.publicMetadata.isPowerPoint as boolean || false;

    return (!isPowerPoint &&
        <footer className={"border-t"}>
            <div className={"flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row"}>
                <Link href={"/"}>
                    <Image src={"/assets/icons/logo.svg"} width={38} height={38} alt={"Logo"}/>
                </Link>

                <p>2024 MathQuiz. All rights reserved.</p>
            </div>
        </footer>
    );
};
