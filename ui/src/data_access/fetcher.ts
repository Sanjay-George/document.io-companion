// @ts-ignore
const directFetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-expect-error Todo: fix this
const electronFetcher = (...args: any[]) => window.electronAPI.fetch(...args).then((res) => res);


export const fetcher = (() => {
    if (window.electronAPI) {
        return electronFetcher;
    }
    return directFetcher;
})();

export const fetch = (() => {
    if (window.electronAPI) {
        return window.electronAPI.fetch;
    }
    return window.fetch;
})();