import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className={"border-t"}>
            <div className={"flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row"}>
                <Link href={"/"}>
                    <Image src={"/assets/icons/logo.svg"} width={38} height={38} alt={"Logo"}/>
                </Link>

                <p>2023 MathQuiz. All rights reserved.</p>
            </div>
        </footer>
    );
};
