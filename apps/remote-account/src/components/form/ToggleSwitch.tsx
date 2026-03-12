import { cn } from "@micro/shared-ui";

type ToggleSwitchProps = {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

export function ToggleSwitch({ id, label, description, checked, disabled = false, onChange }: ToggleSwitchProps) {
    return (
        <div className="flex items-start gap-3">
            <button
                type="button"
                role="switch"
                id={id}
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
                    "transition-colors duration-(--motion-base) ease-in-out",
                    "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
                    checked ? "bg-primary" : "bg-muted",
                    disabled && "cursor-not-allowed opacity-50",
                )}
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0",
                        "transition duration-200 ease-in-out",
                        checked ? "translate-x-5" : "translate-x-0",
                    )}
                />
            </button>
            <div className="flex flex-col gap-0.5">
                <label
                    htmlFor={id}
                    className="text-foreground cursor-pointer text-sm font-medium"
                >
                    {label}
                </label>
                {description && <p className="text-foreground-muted text-xs">{description}</p>}
            </div>
        </div>
    );
}
