// @ts-ignore
const directFetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-expect-error Todo: fix this
const electronFetcher = (...args: any[]) => window.documentioAPI.fetch(...args).then((res) => res);


export const fetcher = (() => {
    if (window.documentioAPI) {
        return electronFetcher;
    }
    return directFetcher;
})();

export const fetch = (() => {
    if (window.documentioAPI) {
        return window.documentioAPI.fetch;
    }
    return window.fetch;
})();