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
        const colors = [
            "#be123c",
            "#a21caf",
            "#b45309",
            "#0e7490",
            "#7e22ce",
            "#1d4ed8",
        ];

        const hash = hashCodeFromString((queue.course.id));
        const colorIndex = Math.abs(hash % (colors.length - 1));
        return colors[colorIndex];
    }
}