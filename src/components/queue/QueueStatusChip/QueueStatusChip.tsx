import React, {FC} from "react";
import {Queue} from "@util/queue/api";
import {Chip} from "@mui/material";

export interface QueueStatusChipProps {
    queue: Queue;
    size?: "small" | "medium";
}

const QueueStatusChip: FC<QueueStatusChipProps> = ({queue, size}) => {
    if (queue.endTime < new Date()) {
        return <Chip label="Ended" size={size} sx={{backgroundColor: "#dc2626", fontWeight: 600, color: "white"}}/>;
    } else if (queue.isCutOff) {
        return <Chip label="Cutoff" size={size} sx={{backgroundColor: "#d97706", fontWeight: 600, color: "white"}}/>;
    } else {
        if (size != "small") {
            return <Chip label="Open" size={size}
                         sx={{backgroundColor: "rgba(255,255,255,0.29)", fontWeight: 600, color: "white"}}/>;
        } else {
            return <Chip label="Open" size={size} sx={{backgroundColor: "#16a34a", fontWeight: 600, color: "white"}}/>;
        }
    }
};

export default QueueStatusChip;


