import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, { TicketStatus } from "@util/queue/api";

export interface EditTicketDialogProps {
    id: string;
    queueID: string;
    status: TicketStatus;
    open: boolean;
    onClose: () => void;
}

type FormData = {
    description: string;
};

const EditTicketDialog: FC<EditTicketDialogProps> = ({id, queueID, status, open, onClose}) => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        QueueAPI.editTicket(id, queueID, status, data.description);
        onClose();
    });

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Edit Ticket</DialogTitle>
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
                <Button type="submit">Edit</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default EditTicketDialog;


