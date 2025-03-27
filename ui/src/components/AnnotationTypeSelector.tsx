import Tooltipped from '@/components/Tooltipped';
import InfoIcon from './icons/InfoIcon';

export type AnnotationType = 'component' | 'page';

export default function AnnotationTypeSelector({ type, onChange }: { type: AnnotationType, onChange: (type: AnnotationType) => void }) {

    const handleSelectionChange = (type: AnnotationType) => {
        onChange(type);
    }

    return (
        <div className='flex items-center mb-2 px-2 text-xs space-x-4'>
            <div className="flex flex-wrap">
                {Tooltipped(
                    () => (
                        <div
                            className='inline-flex items-center space-x-1 text-slate-500 me-3'
                        >
                            <span>Annotation Type </span>
                            <InfoIcon />
                            <span>: </span>
                        </div>
                    ),
                    "Page annotations are attached to a specific page (URL). Component annotations (default) are visible on all pages where the component exists.",
                    {},
                    'bottom-start'
                )}

                <div className="flex items-center me-2">
                    <input
                        id="page-type"
                        name='annotation-type'
                        type="radio"
                        value="page"
                        checked={type === 'page'}
                        onChange={() => handleSelectionChange('page')}
                        className="w-3 h-3 text-black bg-gray-100 border-gray-300"
                    />
                    <label
                        htmlFor="page-type"
                        className="ms-1"
                    >
                        Page
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        id="component-type"
                        name='annotation-type'
                        type="radio"
                        value="component"
                        onChange={() => handleSelectionChange('component')}
                        checked={type === 'component'}
                        className="w-3 h-3 bg-gray-100 border-gray-300 "
                    />
                    <label
                        htmlFor="component-type"
                        className="ms-1"
                    >
                        Component
                    </label>
                </div>

            </div>
        </div>
    )
}