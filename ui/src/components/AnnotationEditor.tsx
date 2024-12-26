import MDEditor, { PreviewType } from '@uiw/react-md-editor';
import { useContext, useMemo, useState } from 'react';
import ButtonPrimary from './ButtonPrimary';
import RightArrowIcon from './icons/RightArrowIcon';
import { PanelPositionContext } from '@/App';

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
    const { panelPosition } = useContext(PanelPositionContext) as any;

    const showSaveButton = useMemo(() =>
        !!handleSave && !!value.length && preview != 'preview', [handleSave, value, preview]);

    return (
        <>
            <MDEditor
                className={
                    panelPosition === 'left'
                        ? 'my-5 shadow-md rounded-xl bg-white min-h-[calc(100vh-300px)]'
                        : 'my-5 shadow-md rounded-xl bg-white min-h-[300px]'
                }
                value={value}
                onChange={(value) => setValue(value || '')}
                preview={preview}
            />

            {showSaveButton &&
                < ButtonPrimary
                    text="Save"
                    icon={<RightArrowIcon />}
                    onClick={() => handleSave && handleSave(value)} />
            }

        </>

    )

}