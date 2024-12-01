import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Link, Tabs, Tab } from '@nextui-org/react'
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin } from '@mdxeditor/editor'
import ButtonPrimary from '@/components/ButtonPrimary'
import RightArrowIcon from '@/components/icons/RightArrowIcon'
import H2 from '@/components/H2';
import '@/App.css';
import '@mdxeditor/editor/style.css'
import LeftArrowIcon from '@/components/icons/LeftArrowIcon'

export default function Sidebar() {

    const documentation = {
        title: 'NextUI Intro',
        url: 'https://nextui.org'
    };

    let tabs = [
        {
            id: "all",
            label: "All (23)",
            content: "This will show all annotations on the page. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            id: "selected",
            label: "Selected (2)",
            content: "This tab will show all annotations of the selected element only. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
    ];

    return (
        <>
            <div className='flex items-center space-x-4 text-primary'>
                <LeftArrowIcon />
                <H2>{documentation?.title}</H2>
            </div>

            <Divider className='mb-5 bg-slate-200' />

            <div className="flex flex-col">
                <Tabs aria-label="Dynamic tabs" items={tabs} size='sm' defaultSelectedKey={'all'}>
                    {(item) => (
                        <Tab key={item.id} title={item.label}>
                            <Card>
                                <CardBody>
                                    {item.content}
                                </CardBody>
                            </Card>
                        </Tab>
                    )}
                </Tabs>
            </div>

            <MDXEditor
                className='my-5 shadow-md rounded-xl bg-white'
                markdown="Hello world"
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

            <Card className="my-5 shadow-md rounded-xl" shadow='md'>
                <CardHeader className="flex gap-3">
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">NextUI</p>
                        <p className="text-small text-accent">nextui.org</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <p>Make beautiful websites regardless of your design experience.</p>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Link
                        className='text-slate-400'
                        href="https://github.com/nextui-org/nextui"
                    >
                        Visit source code on GitHub.
                    </Link>
                </CardFooter>
            </Card>

            <ButtonPrimary text="Add" icon={<RightArrowIcon />} />

            <p className='text-sm font-light text-slate-400 mt-16 text-center border-1 border-slate-200 px-5 py-5 rounded-xl shadow-sm'>Select an element to annotate it. <br />Or select an annotated element to view the annotation.</p>


        </>

    )
}