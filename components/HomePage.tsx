import {currentUser} from "@clerk/nextjs";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export const HomePage = async () => {
    const user = await currentUser();
    const isPowerPoint = user?.publicMetadata.isPowerPoint as boolean || false;

    return (
        <>
            {isPowerPoint ?
                <div
                    className={"wrapper align-middle h-full text-center mt-10 flex flex-row justify-center items-center"}>
                    <Image className={"mr-10"} src={"assets/icons/logo.svg"} width={100} height={100} alt={"logo"}/>
                    <Typography fontSize={"5rem"}>MathQuiz</Typography>
                </div>
                :
                <div
                    className={"wrapper align-middle h-full text-center mt-10 flex flex-row justify-center items-center"}>
                    <Typography color={"primary"} fontSize={"5rem"}>No active question</Typography>
                </div>
            }
        </>
    );
};
