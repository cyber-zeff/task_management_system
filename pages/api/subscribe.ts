import webpush from 'web-push';
import type { NextApiRequest, NextApiResponse } from 'next';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

// In-memory store (fine for demo/semester project)
const subscriptions: webpush.PushSubscription[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const subscription = req.body as webpush.PushSubscription;
        subscriptions.push(subscription);
        res.status(201).json({ message: 'Subscribed' });
    } else {
        res.status(405).end();
    }
}

export { subscriptions };