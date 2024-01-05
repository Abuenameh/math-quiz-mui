export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const handleError = (error: unknown) => {
    console.error(error)
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}