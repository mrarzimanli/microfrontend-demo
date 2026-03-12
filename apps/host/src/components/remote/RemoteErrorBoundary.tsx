import React, { Component, ErrorInfo } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    remoteName: string;
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class RemoteErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(`[RemoteErrorBoundary] ${this.props.remoteName} failed to load:`, error, info);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="border-destructive/20 bg-destructive/5 flex min-h-96 flex-col items-center justify-center gap-4 rounded-lg border p-8 text-center">
                    <div className="bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full">
                        <AlertTriangle
                            className="text-destructive h-7 w-7"
                            aria-hidden="true"
                        />
                    </div>
                    <div>
                        <h3 className="text-foreground text-lg font-semibold">
                            {this.props.remoteName} is unavailable
                        </h3>
                        <p className="text-foreground-muted mt-1 text-sm">
                            This module failed to load. It may be temporarily down or not yet deployed.
                        </p>
                        {this.state.error && (
                            <p className="text-destructive mt-2 text-xs">{this.state.error.message}</p>
                        )}
                    </div>
                    <button
                        onClick={this.handleRetry}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
