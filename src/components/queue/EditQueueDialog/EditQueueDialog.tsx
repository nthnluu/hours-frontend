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
    MenuItem, 
} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, {Queue} from "@util/queue/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";
import {getNextHours} from "@util/shared/getNextHours";

export interface EditQueueDialogProps {
    queueID: string,
    queue: Queue,
    open: boolean;
    onClose: () => void;
}

type FormData = {
    title: string;
    description: string;
    endTimeIndex: number;
    location: string;
};

const EditQueueDialog: FC<EditQueueDialogProps> = ({queueID, queue, open, onClose}) => {
    const times = getNextHours();
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        QueueAPI.editQueue(queueID, data.title, data.description, data.location, times[data.endTimeIndex].timestamp, queue.isCutOff)
            .catch(() => {
                toast.error(errors.UNKNOWN);
            });
        reset();
        onClose();
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
            <DialogTitle>Edit Queue</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("title")}
                        defaultValue={queue.title}
                        required
                        autoFocus
                        label="Title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                    <FormControl fullWidth size="small" variant="standard">
                        <InputLabel id="course-select-label" required>End time</InputLabel>
                        <Select
                            {...register("endTimeIndex")}
                            required
                            defaultValue={0}
                            fullWidth
                            labelId="time-select-label"
                            id="time-select"
                            label="End time"
                            type="text"
                        >
                            {times.map((time, i) => <MenuItem key={time.time} value={i}>{time.time}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField
                        {...register("location")}
                        defaultValue={queue.location}
                        label="Location"
                        type="text"
                        required
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                    <TextField
                        {...register("description")}
                        defaultValue={queue.description}
                        label="Description"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default EditQueueDialog;


