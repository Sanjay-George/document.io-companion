import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin } from '@mdxeditor/editor'
import ButtonPrimary from './ButtonPrimary'
import RightArrowIcon from './icons/RightArrowIcon'
import { Annotation } from '@/models/annotations'


export default function AnnotationEditor({ annotation }: { annotation: Annotation }) {
    return (
        <>
            <p>{annotation?.value}</p>

            <MDXEditor
                className='my-5 shadow-md rounded-xl bg-white min-h-[300px]'
                markdown={annotation?.value}
                plugins={[
                    toolbarPlugin({
                        toolbarClassName: 'my-classname',
                        toolbarContents: () => (
                            <>
                                {' '}
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                            </>
                        )
                    })
                ]}
            />
            <ButtonPrimary text="Save" icon={<RightArrowIcon />} />
        </>

    )

}