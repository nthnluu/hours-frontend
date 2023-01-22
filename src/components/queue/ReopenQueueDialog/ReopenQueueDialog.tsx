import {FC, useEffect} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Select,
    FormControl,
    InputLabel,
    TextField,
    MenuItem, FormControlLabel, Checkbox, FormGroup,
} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, {EditQueueRequest, Queue} from "@util/queue/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";
import {getNextHours} from "@util/shared/getNextHours";

export interface ReopenQueueDialogProps {
    queueID: string,
    queue: Queue,
    open: boolean;
    onClose: () => void;
}

type FormData = {
    endTimeIndex: number;
};

const ReopenQueueDialog: FC<ReopenQueueDialogProps> = ({queueID, queue, open, onClose}) => {
    const times = getNextHours();
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        const req: EditQueueRequest = {
            queueID: queueID,
            title: queue.title,
            description: queue.description!,
            location: queue.location,
            endTime: times[data.endTimeIndex].timestamp,
            isCutOff: queue.isCutOff,
            allowTicketEditing: queue.allowTicketEditing,
            showMeetingLinks: queue.showMeetingLinks,
            faceMaskPolicy: queue.faceMaskPolicy,
            rejoinCooldown: queue.rejoinCooldown,
        };
        toast.promise(QueueAPI.editQueue(req), {
            loading: "Reopening queue...",
            success: "Queue reopened",
            error: errors.UNKNOWN
        })
            .then(() => {
                onClose();
                reset();
            });
    });

    function handleClose() {
        reset();
        onClose();
    }

    useEffect(() => {
        reset();
    }, [reset, open]);

    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Reopen Queue</DialogTitle>
            <DialogContent>
                <Stack spacing={2.5} my={1}>
                    <FormControl fullWidth size="small" variant="standard">
                        <InputLabel id="course-select-label" required>End time</InputLabel>
                        <Select
                            {...register("endTimeIndex")}
                            required
                            defaultValue={Math.max(times.findIndex(time => (time.timestamp.getHours() === queue.endTime.getHours()) && (time.timestamp.getMinutes() === queue.endTime.getMinutes())), 0)}
                            fullWidth
                            labelId="time-select-label"
                            id="time-select"
                            label="End time"
                            type="text"
                        >
                            {times.map((time, i) => <MenuItem key={time.time} value={i}>{time.time}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">Reopen</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default ReopenQueueDialog;


