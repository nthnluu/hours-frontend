import React, {FC, useEffect, useState} from "react";
import {Timestamp} from "@firebase/firestore";
import {intervalToDuration} from "date-fns";
import {Chip} from "@mui/material";

export interface QueueListItemTimerProps {
    claimedAt: Timestamp;
}

const calculateClaimDuration = (claimedAtSeconds?: number): string => {
    if (!claimedAtSeconds) {
        return '';
    }
    const timer = Timestamp.now().seconds - claimedAtSeconds;
    const duration = intervalToDuration({start: 0, end: timer * 1000});
    return `${duration.minutes! < 10 ? '0' + duration.minutes : duration.minutes}:${
        duration.seconds! < 10 ? '0' + duration.seconds : duration.seconds
    }`;
};

const QueueListItemTimer: FC<QueueListItemTimerProps> = ({claimedAt}) => {
    const [time, setTime] = useState(calculateClaimDuration(claimedAt.seconds));

    useEffect(() => {
        const intervalID = setInterval(() => {
            setTime(calculateClaimDuration(claimedAt.seconds));
        }, 1000);

        return () => clearInterval(intervalID);
    }, [claimedAt]);

    return <Chip label={time} size="small" variant="outlined"
                 style={{width: "9ch", overflow: "hidden", fontWeight: 500}}/>;
};

export default QueueListItemTimer;


