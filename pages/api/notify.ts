import webpush from 'web-push';
import type { NextApiRequest, NextApiResponse } from 'next';
import { subscriptions } from './subscribe';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { taskTitle, listTitle } = req.body;

    const payload = JSON.stringify({
        title: 'New Task Added',
        body: `New Task: ${taskTitle} added to list: ${listTitle}`,
    });

    await Promise.allSettled(
        subscriptions.map((sub) => webpush.sendNotification(sub, payload))
    );

    res.status(200).json({ message: 'Notifications sent' });
}