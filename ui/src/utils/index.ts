import { Annotation } from "@/models/annotations";

export function sortAnnotations(annotations: Annotation[]) {
    annotations?.sort((a, _) => {
        if (!a?.type) {
            return 1;
        }
        if (a.type === 'page') {
            return -1;
        }
        return 1;
    });
};

export const renderAnnotationId = (id: string) => {
    return `#${id?.slice(-5)}`;
};