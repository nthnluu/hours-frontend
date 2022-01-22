// TODO(n-young): write function that generates the next 12 hours from the current time in 30 min increments
export default function getNextHours(): { timestamp: Date, time: string }[] {
    return [{timestamp: new Date(), time: "10:00 AM"}];
}