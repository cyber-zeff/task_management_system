import { SpaceContext } from '@lib/context';
import { useCreateList, useFindManyList } from '@lib/hooks';
import { List, Space, User } from '@prisma/client';
import BreadCrumb from 'components/BreadCrumb';
import SpaceMembers from 'components/SpaceMembers';
import TodoList from 'components/TodoList';
import WithNavBar from 'components/WithNavBar';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getEnhancedPrisma } from 'server/enhanced-db';

function CreateDialog() {
    const space = useContext(SpaceContext);

    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [_private, setPrivate] = useState(false);

    const { trigger: createList } = useCreateList({
        onSuccess: () => {
            toast.success('List created successfully!');

            // reset states
            setTitle('');
            setPrivate(false);

            // close modal
            setModalOpen(false);
        },
    });

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (modalOpen) {
            inputRef.current?.focus();
        }
    }, [modalOpen]);

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
        <>
            <input
                type="checkbox"
                id="create-list-modal"
                className="modal-toggle"
                checked={modalOpen}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setModalOpen(e.currentTarget.checked);
                }}
            />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-xl mb-8">Create a Todo list</h3>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center">
                                <label htmlFor="title" className="text-lg inline-block w-20">
                                    Title
                                </label>
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
                                <label htmlFor="private" className="text-lg inline-block w-20">
                                    Private
                                </label>
                                <input
                                    id="private"
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={(e: FormEvent<HTMLInputElement>) => setPrivate(e.currentTarget.checked)}
                                />
                            </div>
                        </div>
                        <div className="modal-action">
                            <input className="btn btn-primary" type="submit" value="Create" />
                            <label htmlFor="create-list-modal" className="btn btn-outline">
                                Cancel
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

type Props = {
    space: Space;
    lists: (List & { owner: User })[];
};

export default function SpaceHome(props: Props) {
    const router = useRouter();

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
            <div className='hidden md:block'>
                <WithNavBar>
                    <div className="px-8 py-2">
                        <BreadCrumb space={props.space} />
                    </div>
                    <div className="p-8">
                        <div className="w-full flex flex-col md:flex-row mb-8 space-y-4 md:space-y-0 md:space-x-4">
                            <label htmlFor="create-list-modal" className="btn max-md:w-full rounded-[12px] bg-[#EC683E] hover:bg-[#e6653e] text-[#fff] btn-wide modal-button">
                                Create a list
                            </label>
                            <SpaceMembers />
                        </div>

                        <ul className="flex flex-wrap gap-6">
                            {lists?.map((list) => (
                                <li key={list.id}>
                                    <TodoList value={list} />
                                </li>
                            ))}
                        </ul>

                        <CreateDialog />
                    </div>
                </WithNavBar>
            </div>
            <div className='block md:hidden'>
                <WithNavBar>
                    <div className='fixed bottom-12 w-full z-10 flex justify-around items-center'>
                        <div className='bg-[#EC683E] rounded-[500px] border border-black py-1 px-1 flex items-center gap-2'>
                            <Link href={'/'} className='flex justify-center gap-1.5 bg-[#E5E1DE] rounded-[500px] py-2.5 ps-3 pe-5 border border-black'>
                                <Image src="/home.svg" alt="Home icon" width={25} height={25} />
                                Home
                            </Link>
                            <Link href={'/calender'} className='py-2.5 ps-2 pe-3'>
                                <Image src="/calender.svg" alt="Calender icon" width={25} height={25} />
                                {/* Calender */}
                            </Link>
                            <SpaceMembers />
                        </div>
                        <label htmlFor="create-list-modal" className='modal-button bg-[#EC683E] rounded-full border border-black flex items-center h-[52px] w-[52px]'>
                            <Image src="/plus.svg" alt="Plus icon" width={30} height={30} className='mx-auto' />
                        </label>
                    </div>
                    <div className="p-8">
                        <ul className="flex flex-wrap gap-6">
                            {lists?.map((list) => (
                                <li key={list.id}>
                                    <TodoList value={list} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </WithNavBar>
            </div>
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
