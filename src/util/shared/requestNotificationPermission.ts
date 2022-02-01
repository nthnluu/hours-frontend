export default async function requestNotificationPermission() {
    if ("Notification" in window) {
        // check for desktop notification permission
        const currPermissionStatus = Notification.permission;

        // user hasn't granted permission yet, ask...
        if (currPermissionStatus !== 'denied') {
            await Notification.requestPermission();
        }
    }
}