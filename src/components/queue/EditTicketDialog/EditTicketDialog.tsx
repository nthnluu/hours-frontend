import {FC, useEffect} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, {Ticket} from "@util/queue/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export interface EditTicketDialogProps {
    ticket: Ticket;
    queueID: string;
    open: boolean;
    onClose: () => void;
}

type FormData = {
    description: string;
};

const EditTicketDialog: FC<EditTicketDialogProps> = ({ticket, queueID, open, onClose}) => {
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        toast.promise(QueueAPI.editTicket(ticket.id, ticket.user.UserID, queueID, ticket.status, data.description), {
            loading: "Updating ticket...",
            success: "Ticket updated!",
            error: errors.UNKNOWN
        })
            .then(() => {
                onClose();
                reset();
            });
    });

    useEffect(() => {
        reset();
    }, [open, reset]);

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("description")}
                        multiline
                        defaultValue={ticket.description}
                        required
                        label="Question"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Edit</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default EditTicketDialog;


