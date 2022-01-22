import {FC, useEffect} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField
} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, {Queue} from "@util/queue/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export interface EditQueueDialogProps {
    queueID: string,
    queue: Queue,
    open: boolean;
    onClose: () => void;
}

type FormData = {
    title: string;
    description: string;
    endTime: Date;
    location: string;
};

const EditQueueDialog: FC<EditQueueDialogProps> = ({queueID, queue, open, onClose}) => {
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        // TODO(n-young): replace with the queue time once implemented
        const placeholderEndTime = new Date();
        placeholderEndTime.setMinutes(placeholderEndTime.getMinutes() + 30);
        QueueAPI.editQueue(queueID, data.title, data.description, data.location, placeholderEndTime, queue.isCutOff)
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
    }, [open]);

    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Edit queue</DialogTitle>
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


