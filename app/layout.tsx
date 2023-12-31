import type {Metadata, Viewport} from 'next'
import './globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "katex/dist/katex.min.css";
import {CssBaseline} from "@mui/material";
import {ClerkProvider} from "@clerk/nextjs";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v14-appRouter";
import ThemeRegistry from "@/app/ThemeRegistry";
import {ConfirmDialog} from "@/components/ConfirmDialog";
import dynamic from "next/dynamic";
import {NextSSRPlugin} from '@uploadthing/react/next-ssr-plugin';
import {ourFileRouter} from "@/app/api/uploadthing/core";
import {extractRouterConfig} from 'uploadthing/server';

export const metadata: Metadata = {
    title: 'MathQuiz',
    description: 'Mathematics quiz app',
    icons: {
        icon: '/assets/icons/logo.svg'
    },
}

export const viewport: Viewport = {
    initialScale: 1,
    width: 'device-width',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const RealtimeComponent = dynamic(() => import("@/components/RealtimeComponent"), {
        ssr: false
    })

    return (
        <ClerkProvider>
            <html lang="en">
            <body>
            <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <RealtimeComponent>
                <CssBaseline enableColorScheme/>
                <AppRouterCacheProvider>
                    <ThemeRegistry options={{key: 'mui'}}>
                        <ConfirmDialog/>
                        {children}
                    </ThemeRegistry>
                </AppRouterCacheProvider>
            </RealtimeComponent>
            </body>
            </html>
        </ClerkProvider>
    )
}
