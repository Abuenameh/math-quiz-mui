import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {SearchParamProps} from "@/types";
import {getQuestionById} from "@/lib/actions/question.actions";
import {Question} from "@/components/Question";
import {getDeclarationsByQuestion} from "@/lib/actions/declaration.actions";
import {IDeclaration} from "@/lib/database/models/declaration.model";
import Image from "next/image";

const QuestionPage = async ({params: {questionId}}: SearchParamProps) => {
    const question = await getQuestionById(questionId);

    const declarations = await getDeclarationsByQuestion(questionId) as IDeclaration[];

    return (
        <>
            <header className={"w-full"}>
                <div className={"wrapper flex items-center justify-center"}>
                        <div className={"flex flex-row items-center"}>
                            <Image src={"/assets/icons/logo.svg"} width={38} height={38} alt={"logo"}/>
                            <Typography ml={2} fontSize={20} fontWeight={"bold"}>MathQuiz</Typography>
                        </div>
                </div>
            </header>

            <Box id="events" className="view-wrapper flex flex-col gap-8 md:gap-12">
                <Question question={question} declarations={declarations} userId={"view_solution"}
                          isAdmin={false}
                          isPowerPoint={true}/>
            </Box>
        </>
    )
}

export default QuestionPage;