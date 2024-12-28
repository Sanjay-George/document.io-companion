interface Window {
    electronAPI: {
        fetch: (url: string, options?: RequestInit) => Promise<any>;
    };
}