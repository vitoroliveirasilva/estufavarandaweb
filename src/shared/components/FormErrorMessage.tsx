type FormErrorMessageProps = {
    message?: string;
};

export function FormErrorMessage({ message }: FormErrorMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <p role="alert" className="text-sm font-medium text-destructive">
            {message}
        </p>
    );
}