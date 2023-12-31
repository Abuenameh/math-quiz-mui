import {Math} from "@/components/Math";
import Button from "@mui/material/Button";
import {SolutionVisibility} from "@/components/SolutionVisibility";

export default function Home() {
    return (
        <main>
            <section>
                <SolutionVisibility/>
                {/*<Math text={"Testing $5 ‵\\sin(x)′ ‵s^2′ ‵‷2s^2‴′ ‵‷‴′ ‶‷2s^2‴″"} />*/}
            </section>
        </main>
    )
}