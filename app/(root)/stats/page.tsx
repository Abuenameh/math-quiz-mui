import {currentUser} from "@clerk/nextjs";
import Typography from "@mui/material/Typography";
import {Statistics} from "@/components/Statistics";

const ProfilePage = async () => {
    const user = await currentUser();

    const userId = user?.publicMetadata?.userId as string;
    const isAdmin = user?.publicMetadata.isAdmin as boolean || false;

    return (
        <>
            {isAdmin ?
                <div className={"wrapper text-center mt-10"}>
                    <Typography color={"primary"} fontSize={"2rem"}>Admin has no statistics</Typography>
                </div>
                :
                <Statistics userId={userId} />
            }
            </>
    );
}

export default ProfilePage;