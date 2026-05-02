import { Space } from '@prisma/client';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Avatar from './Avatar';

type Props = {
    space: Space | undefined;
    user: User | undefined;
};

export default function NavBar({ user, space }: Props) {
    const onSignout = () => {
        void signOut({ callbackUrl: '/signin' });
    };

    return (
        <div className="navbar bg-[#E5E1DE] px-8 py-2 border-b shadow">
            <div className="flex-1">
                <Link href="/" className="flex items-center ml-2">
                    <Image src="/logo.png" alt="Logo" width={80} height={80} className='mt-1' />
                    <div className="text-xl font-semibold ml-3 text-slate-700 hidden md:inline-block">
                        {space?.name}
                    </div>
                </Link>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        {user && <Avatar user={user} />}
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li className="border-b border-gray-200">{user && <div>{user.name || user.email}</div>}</li>
                        <li>
                            <a onClick={onSignout}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
