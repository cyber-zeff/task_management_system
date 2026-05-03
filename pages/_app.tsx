import { SpaceContext, useCurrentSpace, useCurrentUser, UserContext } from '@lib/context';
import AuthGuard from 'components/AuthGuard';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider as ZenStackHooksProvider } from '../lib/hooks';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import '../styles/globals.css';

function AppContent(props: { children: JSX.Element | JSX.Element[] }) {
    const user = useCurrentUser();
    const space = useCurrentSpace();

    return (
        <AuthGuard>
            <UserContext.Provider value={user}>
                <SpaceContext.Provider value={space}>
                    <div className="h-screen flex flex-col">{props.children}</div>
                </SpaceContext.Provider>
            </UserContext.Provider>
        </AuthGuard>
    );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,
      user-scalable=0" />
                <meta name="theme-color" content="#ffffff" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <title>Simplifyd</title>
            </Head>
            <SessionProvider session={session}>
                <ZenStackHooksProvider value={{ endpoint: '/api/model' }}>
                    <AppContent>
                        <div className="flex-grow h-100 bg-[#E5E1DE]">
                            <Component {...pageProps} />
                            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} />
                        </div>
                    </AppContent>
                </ZenStackHooksProvider>
            </SessionProvider>
            <Analytics />
        </>
    );
}

export default MyApp;
