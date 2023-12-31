'use client'

import * as Ably from "ably";
import {AblyProvider} from "ably/react";

export default function RealtimeComponent({
                                      children,
                                  }: {
    children: React.ReactNode
}) {
    const client = new Ably.Realtime.Promise({ authUrl: "/api/ably/token", authMethod: "POST"});
    return (
        <AblyProvider client={client}>
            {children}
        </AblyProvider>
    );
};

