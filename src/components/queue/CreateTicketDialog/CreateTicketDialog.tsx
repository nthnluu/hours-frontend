import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI from "@util/queue/api";
import {toast} from "react-hot-toast";

export interface CreateTicketDialogProps {
    open: boolean;
    onClose: () => void;
    queueID: string;
}

type FormData = {
    description: string;
};

const CreateTicketDialog: FC<CreateTicketDialogProps> = ({open, onClose, queueID}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        toast.promise(QueueAPI.createTicket(queueID, data.description), {
            loading: "Creating ticket...",
            success: "Ticket created!",
            error: "Something went wrong, please try again later."
        })
            .then(() => {
                onClose();
                reset();
            });
    });

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>Join Queue</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("description")}
                        multiline
                        required
                        autoFocus
                        label="Question"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateTicketDialog;


