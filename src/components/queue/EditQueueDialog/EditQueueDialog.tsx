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
    allowTicketEditing: boolean;
    showMeetingLinks: boolean;
};

const EditQueueDialog: FC<EditQueueDialogProps> = ({queue, open, onClose}) => {
    const times = getNextHours();
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        const req: EditQueueRequest = {
            queueID: queue.id,
            title: data.title,
            description: data.description,
            location: data.location,
            endTime: times[data.endTimeIndex].timestamp,
            isCutOff: queue.isCutOff,
            allowTicketEditing: data.allowTicketEditing,
            showMeetingLinks: data.showMeetingLinks
        };
        toast.promise(QueueAPI.editQueue(req), {
            loading: "Updating queue...",
            success: "Queue updated",
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
            <DialogTitle>Edit Queue</DialogTitle>
            <DialogContent>
                <Stack spacing={2.5} my={1}>
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
                    <Stack direction="row" spacing={1.5}>
                        <TextField
                            {...register("location")}
                            defaultValue={queue.location}
                            required
                            label="Location"
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
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox
                            defaultChecked={queue.allowTicketEditing} {...register("allowTicketEditing")}/>}
                        label="Allow students to edit tickets once created"/>
                    <FormControlLabel
                        control={<Checkbox defaultChecked={queue.showMeetingLinks} {...register("showMeetingLinks")}/>}
                        label="Show meeting links on claim"/>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default EditQueueDialog;


