import { Loader2 } from "lucide-react";

interface Props {
    label?: string;
}

export function RemoteSuspenseFallback({ label = "Loading module..." }: Props) {
    return (
        <div className="flex min-h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2
                    className="text-primary h-10 w-10 animate-spin"
                    aria-hidden="true"
                />
                <p className="text-foreground-muted text-sm">{label}</p>
            </div>
        </div>
    );
}
