import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

const f = createUploadthing({
    /**
     * Log out more information about the error, but don't return it to the client
     * @see https://docs.uploadthing.com/errors#error-formatting
     */
    errorFormatter: (err) => {
        console.log("Error uploading file", err.message);
        console.log("  - Above error caused by:", err.cause);

        return { message: err.message };
    },
});

/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "16MB" } })
        .middleware(({ req }) => {
            return {};
        })
        .onUploadComplete(({ file, metadata }) => {
            console.log("upload completed", file);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
