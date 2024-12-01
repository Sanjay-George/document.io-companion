import useSWR from "swr";
import { fetcher } from "./fetcher";

// TODO: setup vite env variables
const API_URL = 'http://localhost:5000';


export const ALL_ANNOTATIONS_KEY = (documentationId: string) =>
    `${API_URL}/pages/${documentationId}/annotations`;

export const useAnnotations = (documentationId: string): { data: any[], isLoading: boolean, error: any } =>
    useSWR(ALL_ANNOTATIONS_KEY(documentationId), fetcher);

