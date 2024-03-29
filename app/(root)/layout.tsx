import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className={"flex h-screen flex-col"}>
            <Header/>
            <main className={"flex flex-col flex-1"}>{children}</main>
            <Footer/>
        </div>
    )
}
