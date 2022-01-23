import {Queue} from "@util/queue/api";

function hashCodeFromString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export default function getQueueColor(queue: Queue): string {
    if (queue.endTime < new Date()) {
        return "rgba(0,0,0,0.1)";
    } else {
        const colors = ["#06325e", "#234806", "#0c455d", "#520c5d", "#5d150c", "#650228", "#026559", "#026519"];
        const hash = hashCodeFromString((queue.course.id + queue.course.title));
        const colorIndex = hash % colors.length;
        return colors[colorIndex];
    }
}