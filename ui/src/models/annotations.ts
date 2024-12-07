export interface Annotation {
    _id?: string;
    value: string;
    target: string;
    url: string;
    documentationId: string;
    created: Date;
    updated: Date;
    type: 'page' | 'component';
    comments?: string[];
}