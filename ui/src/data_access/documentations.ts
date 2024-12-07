import useSWR from "swr";
import { fetcher } from "./fetcher";

// TODO: setup vite env variables
const API_URL = 'http://localhost:5000';

export const SINGLE_DOCUMENTATION_KEY = (id: string) =>
    `${API_URL}/documentations/${id}`;


export const useDocumentation = (id: string): { data: any | null, isLoading: boolean, error: any } => {
    if (!id) {
        useSWR(null);
        return { data: null, isLoading: false, error: 'ID not provided' };
    }
    return useSWR(SINGLE_DOCUMENTATION_KEY(id), fetcher);
}