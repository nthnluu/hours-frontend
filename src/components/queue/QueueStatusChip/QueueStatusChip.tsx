import React, {FC} from "react";
import {Queue} from "@util/queue/api";
import {Chip} from "@mui/material";

export interface QueueStatusChipProps {
    queue: Queue;
    size?: "small" | "medium";
}

const QueueStatusChip: FC<QueueStatusChipProps> = ({queue, size}) => {
    if (queue.endTime < new Date()) {
        return <Chip label="Ended" size={size} color="error" sx={{fontWeight: 600}}/>;
    } else if (queue.isCutOff) {
        return <Chip label="Cutoff" size={size} color="warning" sx={{fontWeight: 600}}/>;
    } else {
        return <Chip label="Open" size={size} color="success" sx={{fontWeight: 600}}/>;
    }
};

export default QueueStatusChip;


