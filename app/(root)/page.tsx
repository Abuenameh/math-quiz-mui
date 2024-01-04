import {Math} from "@/components/Math";
import Button from "@mui/material/Button";
import {CurrentQuestion} from "@/components/CurrentQuestion";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { UploadButton, generateComponents } from "@uploadthing/react";
import {OurFileRouter} from "@/app/api/uploadthing/core";
import {HomePage} from "@/components/HomePage";

export default function Home() {
    return (
        <>
            <CurrentQuestion />
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