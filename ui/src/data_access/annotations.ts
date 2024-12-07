import useSWR, { mutate } from "swr";
import { fetcher } from "./fetcher";
import { Annotation } from "@/models/annotations";

// TODO: setup vite env variables
const API_URL = 'http://localhost:5000';


export const ALL_ANNOTATIONS_KEY = (documentationId: string) =>
    `${API_URL}/documentations/${documentationId}/annotations`;

export const ANNOTATIONS_BY_TARGET_KEY = (documentationId: string, target: string) =>
    `${API_URL}/documentations/${documentationId}/annotations?target=${target}`;

export const SINGLE_ANNOTATION_KEY = (annotationId: string) =>
    `${API_URL}/annotations/${annotationId}`;


// Methods

export const useAnnotations = (documentationId: string): { data: any[], isLoading: boolean, error: any } => {
    if (!documentationId) {
        useSWR(null);
        return { data: [], isLoading: false, error: 'Documentation ID not provided' };
    }
    return useSWR(ALL_ANNOTATIONS_KEY(documentationId), fetcher);
}

export const useAnnotationsByTarget = (documentationId: string, target: string | null): { data: any[], isLoading: boolean, error: any } => {
    if (!documentationId) {
        useSWR(null);
        return { data: [], isLoading: false, error: 'Documentation ID not provided' };
    }
    if (!target) {
        return useAnnotations(documentationId);
    }
    return useSWR(ANNOTATIONS_BY_TARGET_KEY(documentationId, encodeURIComponent(target)), fetcher)
};

export const useAnnotation = (annotationId: string): { data: any, isLoading: boolean, error: any } => {
    if (!annotationId) {
        useSWR(null);
        return { data: null, isLoading: false, error: 'Annotation ID not provided' };
    }
    return useSWR(SINGLE_ANNOTATION_KEY(annotationId), fetcher);
}

export const addAnnotation = async (annotation: Annotation) => {
    await fetch(`${API_URL}/annotations/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(annotation)
    });
}