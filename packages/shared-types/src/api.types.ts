export interface ServerFieldError {
    field: string;
    message: string;
}

export type MutationOutcome<TData = void> =
    | { success: true; data?: TData }
    | { success: false; serverError: ServerFieldError };
