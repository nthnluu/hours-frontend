import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI from "@util/queue/api";

export interface CreateCourseDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    title: string;
    description: string;
    courseID: string;
};

const CreateQueueDialog: FC<CreateCourseDialogProps> = ({open, onClose}) => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => QueueAPI.createQueue(data.title, data.description, data.courseID));

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Create queue</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("title")}
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
                        required
                        label="Description"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />

                    <TextField
                        {...register("courseID")}
                        required
                        label="Course ID"
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

export default CreateQueueDialog;


