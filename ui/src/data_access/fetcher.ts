const extensionFetcher = (...args: any[]) => (window as any).documentioAPI.fetch(...args);
const directFetcher = (url: string, options?: RequestInit) => window.fetch(url, options).then((res) => res.json());

export const fetcher = (window as any).documentioAPI ? extensionFetcher : directFetcher;

export const fetch = (window as any).documentioAPI
    ? (window as any).documentioAPI.fetch
    : window.fetch.bind(window);