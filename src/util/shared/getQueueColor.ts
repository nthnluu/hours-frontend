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

export default function getQueueColor(queue: Queue): { bgColor: string; gradient: string; } {
    if (queue.endTime < new Date()) {
        return {bgColor: "#1f1f1f", gradient: ""};
    } else {
        const colors = [
            {bgColor: "#0093E9", gradient: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"},
            {bgColor: "#F4D03F", gradient: "linear-gradient(19deg, #F4D03F 0%, #16A085 100%)"},
            {bgColor: "#4158D0", gradient: "linear-gradient(19deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"},
            {bgColor: " #7b4397", gradient: "linear-gradient(19deg, #dc2430, #7b4397)"},
            {bgColor: "#08AEEA", gradient: "linear-gradient(19deg, #08AEEA 0%, #2AF598 100%)"},
            {bgColor: "#21D4FD", gradient: "linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)"},

        ];

        const hash = hashCodeFromString((queue.course.id));
        const colorIndex = Math.abs(hash % (colors.length - 1));
        return colors[colorIndex];
    }
}