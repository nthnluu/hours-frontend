import {format} from "date-fns";

export default function formatEndTime(endTime: Date): string {
    return format(endTime, `'End${endTime < new Date() ? "ed" : "s"} at' h:mm a`);
}