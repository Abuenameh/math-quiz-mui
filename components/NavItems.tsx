'use client';

import NextLink from "next/link";
import {usePathname} from "next/navigation";
import {Link} from "@mui/material";

export const headerLinks = [
    {
        label: 'Home',
        route: '/',
    },
    {
        label: 'Courses',
        route: '/courses',
    },
    {
        label: 'My Statistics',
        route: '/stats',
    },
]

export const NavItems = () => {
    const pathname = usePathname();

    return (
        <ul className={"md:flex-between flex w-full flex-col items-start gap-5 md:flex-row"}>
            {headerLinks.map((link) => {
                const isActive = pathname === link.route;
                return (
                    <li key={link.route} className={"flex-center p-medium-16 whitespace-nowrap"}>
                        <Link color={`${isActive ? "primary.main" : ""}`} component={NextLink} href={link.route}
                              underline={"none"}>{link.label}</Link>
                    </li>
                );
            })}
        </ul>
    );
};
