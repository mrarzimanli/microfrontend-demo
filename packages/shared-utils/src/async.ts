export function delay(ms = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
