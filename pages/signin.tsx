import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (router.query.error) {
            if (router.query.error === 'OAuthCreateAccount') {
                toast.error('Unable to signin. The user email may be already in use.');
            } else {
                toast.error(`Authentication error: ${router.query.error.toString()}`);
            }
        }
    }, [router]);

    async function onSignin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const signInResult = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        if (signInResult?.ok) {
            window.location.href = '/';
        } else {
            toast.error(`Signin failed. Please check your email and password.`);
        }
    }

    return (
        <>
            <div className="flex flex-col md:items-center justify-center px-6 pt-0 lg:pt-8 mx-auto h-screen bg-[#E5E1DE]">
                <Link href="/" className='hidden md:block'>
                    <div className="flex space-x-4 items-center mb-6 lg:mb-10">
                        <h1 className="text-3xl">Welcome to </h1>
                        <Image src="/logo.png" width={120} height={120} alt="logo" className='mt-1.5 md:mt-2.5' />
                    </div>
                </Link>
                <div className="md:items-center md:justify-center w-full bg-[#E5E1DE] md:bg-[#f4f2f1] rounded-lg md:shadow lg:flex md:mt-0 lg:max-w-screen-md xl:p-0">
                    <div className="w-full md:space-y-8 p-0 lg:p-16">
                        <h2 className="text-[28px] font-bold text-gray-900 lg:text-3xl">Login to your account</h2>
                        <h4>Please use your registered email <br className='block md:hidden' /> address and password for login</h4>

                        <form className="mt-8" action="#" onSubmit={(e) => void onSignin(e)}>
                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-black text-[#BFBAB4] sm:text-sm rounded-[12px] block w-full p-2.5"
                                    placeholder="jhondoe@gmail.com"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-black text-[#BFBAB4] sm:text-sm rounded-[12px] block w-full p-2.5"
                                    required
                                />
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="remember"
                                        aria-describedby="remember"
                                        name="remember"
                                        type="checkbox"
                                        className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="font-medium text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4 mt-4">
                                <button className="btn rounded-[12px] bg-[#EC683E] hover:bg-[#e6653e] text-[#fff] text-[16px] w-full lg:w-fit" type="submit">
                                    Continue
                                </button>

                                <div className='md:hidden flex items-center justify-center text-[#BFBAB4] text-[16px]'>
                                    <div className='h-[1px] w-[144px] bg-[#BFBAB4]'></div>
                                    <div className='mx-4'>Or</div>
                                    <div className='h-[1px] w-[144px] bg-[#BFBAB4]'></div>
                                </div>

                                <div
                                    className="btn rounded-[12px] btn-outline w-full lg:w-fit"
                                    onClick={() => void signIn('github', { callbackUrl: '/' })}
                                >
                                    Sign in with GitHub
                                </div>
                            </div>

                            <div className="hidden md:block mt-4 text-sm font-medium text-gray-500">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-[#EC683E] underline">
                                    Sign up instead
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-8 w-full text-center md:hidden text-sm font-medium text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#EC683E] underline">
                    Sign up instead
                </Link>
            </div>
        </>
    );
}
