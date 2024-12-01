import { Annotation } from '@/models/annotations';
import MDEditor from '@uiw/react-md-editor';


export default function AnnotationEditor({ annotation }: { annotation: Annotation }) {

    return (
        <>
            <MDEditor
                className='my-5 shadow-md rounded-xl bg-white min-h-[calc(100vh-300px)]'
                value={annotation?.value}
                // TODO: Implement setAnnotation
                // onChange={setAnnotation as any}
                preview='preview'
            />
        </>

    )

}