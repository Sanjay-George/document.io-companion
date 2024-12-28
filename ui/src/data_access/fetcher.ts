// @ts-ignore
export const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// TODO: Use a factory to create fetcher based on the environment

// @ts-expect-error Todo: fix this
export const fetcher2 = (...args: any[]) => window.electronAPI.fetch(...args).then((res) => res);