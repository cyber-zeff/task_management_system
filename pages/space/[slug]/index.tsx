import { SpaceContext } from '@lib/context';
import { useCreateList, useFindManyList } from '@lib/hooks';
import { List, Space, User } from '@prisma/client';
import BreadCrumb from 'components/BreadCrumb';
import TodoList from 'components/TodoList';
import WithNavBar from 'components/WithNavBar';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getEnhancedPrisma } from 'server/enhanced-db';
import SpaceMembers, { SpaceMembersModal } from 'components/SpaceMembers';

function CreateDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const space = useContext(SpaceContext);

    const [title, setTitle] = useState('');
    const [_private, setPrivate] = useState(false);

    const { trigger: createList } = useCreateList({
        onSuccess: () => {
            toast.success('List created successfully!');
            setTitle('');
            setPrivate(false);
            onClose();
        },
    });

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        void createList({
            data: {
                title,
                private: _private,
                space: { connect: { id: space!.id } },
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
                <h3 className="font-bold text-xl mb-8">Create a Todo list</h3>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center">
                            <label htmlFor="title" className="text-lg inline-block w-20">Title</label>
                            <input
                                id="title"
                                type="text"
                                required
                                placeholder="Title of your list"
                                ref={inputRef}
                                className="input input-bordered w-full max-w-xs mt-2"
                                value={title}
                                onChange={(e: FormEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)}
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="private" className="text-lg inline-block w-20">Private</label>
                            <input
                                id="private"
                                type="checkbox"
                                className="checkbox"
                                onChange={(e: FormEvent<HTMLInputElement>) => setPrivate(e.currentTarget.checked)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="btn btn-outline rounded-[12px]"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <input
                            className="btn rounded-[12px] bg-[#EC683E] hover:bg-[#e6653e] text-[#fff]"
                            type="submit"
                            value="Create"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

type Props = {
    space: Space;
    lists: (List & { owner: User })[];
};

export default function SpaceHome(props: Props) {
    const router = useRouter();
    const [createListOpen, setCreateListOpen] = useState(false);

    const { data: lists } = useFindManyList(
        {
            where: {
                space: {
                    slug: router.query.slug as string,
                },
            },
            include: {
                owner: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        },
        {
            disabled: !router.query.slug,
            fallbackData: props.lists,
        }
    );

    return (
        <>
            <WithNavBar>
                {/* DESKTOP */}
                <div className='hidden md:block'>
                    <div className="px-8 py-2">
                        <BreadCrumb space={props.space} />
                    </div>
                    <div className="p-8">
                        <div className="w-full flex flex-col md:flex-row mb-8 space-y-4 md:space-y-0 md:space-x-4">
                            <button
                                className="btn max-md:w-full rounded-[12px] bg-[#EC683E] hover:bg-[#e6653e] text-[#fff] btn-wide"
                                onClick={() => setCreateListOpen(true)}
                            >
                                Create a list
                            </button>
                            <SpaceMembers />
                        </div>
                        <ul className="flex flex-wrap gap-6">
                            {lists?.map((list) => (
                                <li key={list.id}>
                                    <TodoList value={list} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* MOBILE */}
                <div className='block md:hidden'>
                    <div className='fixed bottom-12 w-full z-10 flex justify-around items-center'>
                        <div className='bg-[#EC683E] rounded-[500px] border border-black py-1 px-1 flex items-center gap-2'>
                            <Link href={'/'} className='flex justify-center gap-1.5 bg-[#E5E1DE] rounded-[500px] py-2.5 ps-3 pe-5 border border-black'>
                                <Image src="/home.svg" alt="Home icon" width={25} height={25} />
                                Home
                            </Link>
                            <Link href={'/calender'} className='py-2.5 ps-2 pe-3'>
                                <Image src="/calender.svg" alt="Calender icon" width={25} height={25} />
                            </Link>
                            <SpaceMembers />
                        </div>
                        <button
                            className='bg-[#EC683E] rounded-full border border-black flex items-center h-[52px] w-[52px]'
                            onClick={() => setCreateListOpen(true)}
                        >
                            <Image src="/plus.svg" alt="Plus icon" width={30} height={30} className='mx-auto' />
                        </button>
                    </div>
                    <div className="p-8 pb-32">
                        <ul className="flex flex-wrap gap-6">
                            {lists?.map((list) => (
                                <li key={list.id}>
                                    <TodoList value={list} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </WithNavBar>

            {/* Modals rendered at root level, outside WithNavBar */}
            <CreateDialog isOpen={createListOpen} onClose={() => setCreateListOpen(false)} />
            <SpaceMembersModal />
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, params }) => {
    const db = await getEnhancedPrisma({ req, res });

    const space = await db.space.findUnique({
        where: { slug: params!.slug as string },
    });
    if (!space) {
        return {
            notFound: true,
        };
    }

    const lists = await db.list.findMany({
        where: {
            space: { slug: params?.slug as string },
        },
        include: {
            owner: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    return {
        props: { space, lists },
    };
};
