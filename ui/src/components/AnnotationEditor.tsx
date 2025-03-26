import MDEditor, { PreviewType, commands } from '@uiw/react-md-editor';
import { useMemo, useState } from 'react';
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

    const isPreview = preview === 'preview';
    const [value, setValue] = useState(content || '');
    const [rightToolbarBtns, setRightToolbarBtns] = useState(commands.getExtraCommands());

    const showSaveButton = useMemo(() =>
        !!handleSave && !!value.length && !isPreview, [handleSave, value, preview]);

    useMemo(() => {
        const extraCommands = commands.getExtraCommands();
        if (isPreview) {
            // remove the preview, live and edit buttons from the toolbar
            setRightToolbarBtns(
                extraCommands.filter((command) => command.keyCommand !== 'preview')
            );
        }
    }, [isPreview]);


    return (
        <>
            <MDEditor
                className={
                    'my-3 shadow-md rounded-xl bg-white'
                }
                value={value}
                height={"calc(100% - 200px)"}
                onChange={(value) => setValue(value || '')}
                commands={isPreview ? [] : commands.getCommands()}
                extraCommands={rightToolbarBtns}
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