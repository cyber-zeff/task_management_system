self.addEventListener('push', function (event) {
    const data = event.data?.json() ?? {};
    event.waitUntil(
        self.registration.showNotification(data.title || 'Simplifyd', {
            body: data.body || 'You have a new notification',
            icon: '/icons/icon-192x192.png',
        })
    );
});