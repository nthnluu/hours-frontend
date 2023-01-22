export default function playDoorbell() {
    const audio = new Audio("/doorbell.mp3");
    audio.play();
}