'use client';

import {useState} from "react";
import Image from "next/image";
import Drawer from "@mui/material/Drawer";
import {NavItems} from "@/components/NavItems";
import Divider from "@mui/material/Divider";
import MenuIcon from '@mui/icons-material/Menu';

export const MobileNav = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className={"md:hidden"}>
            <MenuIcon onClick={() => setOpen(true)} className={"cursor-pointer"} fontSize={"large"}/>
            <Drawer anchor={"right"} onClose={() => setOpen(false)} open={open}>
                <div className={"flex flex-col gap-3 bg-white p-4 md:hidden"}>
                    <Image src={"assets/icons/logo.svg"}
                           alt={"logo"} width={38} height={38}/>
                    <Divider/>
                    <NavItems/>
                </div>
            </Drawer>
        </nav>
    );
};
