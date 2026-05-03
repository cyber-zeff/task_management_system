import { useCurrentUser } from '@lib/context';
import { Space } from '@prisma/client';
import Spaces from 'components/Spaces';
import WithNavBar from 'components/WithNavBar';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getEnhancedPrisma } from 'server/enhanced-db';

type Props = {
    spaces: Space[];
};

const Home: NextPage<Props> = ({ spaces }) => {
    const user = useCurrentUser();

    return (
        <WithNavBar>
            {user && (
                <div className="mt-8 text-center flex flex-col items-center w-full">
                    <h1 className="text-2xl text-gray-800">Welcome {user.name || user.email}!</h1>

                    <div className="w-full p-8">
                        <h2 className="text-lg md:text-xl text-left mb-8 text-gray-700 flex justify-between">
                            <h2 className='font-medium text-[24px]'>Space</h2>
                            <Link href="/create-space" className="flex items-center gap-2 text-black">
                                <Image src="/add.svg" alt="Arrow icon" width={20} height={20} className='mt-0.5' />
                                Create
                            </Link>
                        </h2>
                        <Spaces spaces={spaces} />
                    </div>
                </div>
            )}
        </WithNavBar>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const db = await getEnhancedPrisma(ctx);
    const spaces = await db.space.findMany();
    return {
        props: { spaces },
    };
};

export default Home;
