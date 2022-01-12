import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, {Queue} from "@util/queue/api";

export interface EditQueueDialogProps {
    queueID: string,
    queue: Queue,
    open: boolean;
    onClose: () => void;
}

type FormData = {
    title: string;
    description: string;
};

const EditQueueDialog: FC<EditQueueDialogProps> = ({queueID, queue, open, onClose}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        QueueAPI.editQueue(queueID, data.title, data.description, queue.isActive);
        reset();
        onClose();
    });

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
                        variant="outlined"
                    />

                    <TextField
                        {...register("description")}
                        defaultValue={queue.description}
                        required
                        label="Description"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default EditQueueDialog;


