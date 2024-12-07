import MDEditor, { PreviewType } from '@uiw/react-md-editor';
import { useContext, useState } from 'react';
import ButtonPrimary from './ButtonPrimary';
import RightArrowIcon from './icons/RightArrowIcon';

export default function AnnotationEditor({
    content,
    handleSave,
    preview = 'preview'
}
    : {
        content: string,
        handleSave?: (value: string) => void,
        preview?: PreviewType
    }) {

    const [value, setValue] = useState(content || '');

    return (
        <>
            <MDEditor
                className='my-5 shadow-md rounded-xl bg-white min-h-[calc(100vh-300px)]'
                value={value}
                onChange={(value) => setValue(value || '')}
                preview={preview}
            />

            {handleSave && !!value.length && < ButtonPrimary text="Save" icon={<RightArrowIcon />} onClick={() => handleSave(value)} />}

        </>

    )

}