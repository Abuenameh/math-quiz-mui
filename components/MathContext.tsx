'use client'

import {MathJaxContext} from "better-react-mathjax";

const config = {
    loader: {load: ["[tex]/physics"]},
    tex: {packages: {"[+]": ["physics"]}}
}

export const MathContext = ({
                                children,
                            }: {
    children: React.ReactNode
}) => {
    return (
        <MathJaxContext config={config}>
            {children}
        </MathJaxContext>
    );
};
