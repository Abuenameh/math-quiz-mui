'use client'

import {ChannelResult, useChannel} from "ably/react";
import {createContext, useContext} from "react";
import * as Ably from "ably";

// const client = new Ably.Realtime({})

// const ChannelsContext = createContext<{question: ChannelResult, solution: ChannelResult }>(null)
const ChannelsContext = createContext<{question: ChannelResult|null, solution: ChannelResult|null }>({question: null, solution: null})
// const ChannelsContext = createContext<{question: null, solution: null }>({question: null, solution: null})

export function useChannels() {
    return useContext(ChannelsContext);
}

export const ChannelProvider = ({children}: {children: React.ReactNode}) => {
    const questionChannel = null;//useChannel("current-question")
    const solutionChannel = null;//useChannel("show-solution")

    const channelState = {question: questionChannel, solution: solutionChannel}

    // const ChannelContext = createContext(channelState)
    // console.error("\n\n\nChannel Provider\n\n\n")

    return (
        <>
            {/*<ChannelsContext.Provider value={channelState}>*/}
            {children}
            {/*</ChannelsContext.Provider>*/}
        </>
    );
};
