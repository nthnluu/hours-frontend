import {format, add, getMinutes, getHours} from "date-fns";

const dtformat = "h:mm a";
const numhours = 12;
const hoursplits = 2;

export function getNextHours(): { timestamp: Date, time: string }[] {
    const hoursplitsminutes = 60 / hoursplits;
    const endTime = add(new Date(), { hours: numhours });
    const timeStops = [];

    let thisTime = add(new Date(), { minutes: 2 * hoursplitsminutes - (getMinutes(new Date) % hoursplitsminutes) });
    while (thisTime <= endTime) {
        // Only works if numhours <= 24
        const isToday = getHours(thisTime) >= getHours(new Date());
        const prefix = isToday ? "Today, " : "Tomorrow, ";
        const thisTimeString = prefix + format(thisTime, dtformat);
        timeStops.push({ timestamp: thisTime, time: thisTimeString });
        thisTime = add(thisTime, { minutes: hoursplitsminutes });
    }
    return timeStops;
}
