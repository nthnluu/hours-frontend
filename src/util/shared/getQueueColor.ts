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
        return "#1f1f1f";
    } else {
        const colors = ["#3f51b5", "#2196f3", "#673ab7", "#00838f", "#880e4f", "#4a148c", "#b71c1c", "#004d40"];
        const hash = hashCodeFromString((queue.course.id + queue.course.title + queue.title));
        const colorIndex = Math.abs(hash % (colors.length - 1));
        return colors[colorIndex];
    }
}