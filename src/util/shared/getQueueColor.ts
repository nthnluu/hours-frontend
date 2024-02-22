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

const gradients = {
    bluePinkPurple: "linear-gradient(to right, #4E82EE, #9b72cb, #d96570)",
    summer: "linear-gradient(to right, #22c1c3, #fdbb2d)",
    blueGreen: "linear-gradient(to right, #5433ff, #20bdff, #a5fecb)",
    babyPink: "linear-gradient(to right, #9796f0, #fbc7d4)",
    babyBlue: "linear-gradient(to right, #66d1bd, #ACB6E5)",
    hotPink: "linear-gradient(to right, #ec008c, #fc6767)",
    green: "linear-gradient(to right, #02AAB0, #00CDAC)",
};

export default function getQueueColor(queue: Queue): string {
    if (queue.endTime < new Date()) {
        return "#1f1f1f";
    } else {
        const colors = [gradients.green, gradients.hotPink, gradients.babyBlue, gradients.babyPink, gradients.blueGreen, gradients.summer, gradients.bluePinkPurple, ];
        const hash = hashCodeFromString((queue.course.id + queue.course.title + queue.title));
        const colorIndex = Math.abs(hash % (colors.length - 1));
        return colors[colorIndex];
    }
}
