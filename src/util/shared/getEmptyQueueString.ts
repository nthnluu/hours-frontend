export default function getEmptyQueueString() {
    const strings = [
        "No one is here... yet 😉",
        "Enjoy the empty queue 😌",
        "A beautiful, empty queue.",
        "Fortunately, no one is here.",
    ];
    return strings[Math.floor(Math.random() * strings.length)];
}