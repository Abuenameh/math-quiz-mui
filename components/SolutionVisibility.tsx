'use client'

import Button from "@mui/material/Button";
import * as Ably from "ably";
import {AblyProvider, useAbly, useChannel} from "ably/react";
import dynamic from "next/dynamic";

const PublishSolutionVisibility = () => {

    const ably = useAbly();
    const { channel } = useChannel({channelName:"show-solution",options:{params: { rewind: "1" }}});
    channel.params = { rewind: "1" }
    // const { channel } = useChannel("show-solution");
    // channel.setOptions({params: { rewind: "1" }}).catch(console.error);

    const showSolution = () => {
channel.publish({ data: "1" }).catch(console.error);
    }

    const hideSolution = () => {
        channel.publish({ data: "0" }).catch(console.error);
    }

    return (
        <>
            <Button variant="contained" onClick={showSolution}>Show Solution</Button>
            <Button variant="contained" onClick={hideSolution}>Hide Solution</Button>
        </>
    );
}

const AblySolutionVisibility = () => {
    // const ably = useAbly();
    //
    // ably.connection.connect();

    return (
        <>
            <PublishSolutionVisibility>
        </PublishSolutionVisibility>
            </>
    );
}

export const SolutionVisibility = () => {
    const RealtimeComponent = dynamic(() => import("@/components/RealtimeComponent"), {
        ssr: false
    })

    return (
        <>
            <RealtimeComponent>
           <PublishSolutionVisibility/>
            </RealtimeComponent>
        </>
    );
};
