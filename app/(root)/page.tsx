import {CurrentQuestion} from "@/components/CurrentQuestion";
import {HomePage} from "@/components/HomePage";

export default function Home() {
    return (
        <>
            <CurrentQuestion/>
            <main>
                <section>
                    <HomePage/>
                    {/*<div className={"wrapper text-center mt-10"}>*/}
                    {/*    <Typography color={"primary"} fontSize={"2rem"}>No active question</Typography>*/}
                    {/*</div>*/}
                    {/*<SolutionVisibility/>*/}
                    {/*<Math text={"Testing $5 ‵\\sin(x)′ ‵s^2′ ‵‷2s^2‴′ ‵‷‴′ ‶‷2s^2‴″"} />*/}
                </section>
            </main>
        </>
    )
}