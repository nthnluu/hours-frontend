import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, FormControlLabel, Checkbox} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI from "@util/queue/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export interface CreateTicketDialogProps {
    open: boolean;
    onClose: () => void;
    queueID: string;
}

type FormData = {
    description: string;
    anonymize: boolean;
};

const CreateTicketDialog: FC<CreateTicketDialogProps> = ({open, onClose, queueID}) => {
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(async data => {
        // check for desktop notification permission
        const currPermissionStatus = Notification.permission;

        // user hasn't granted permission yet, ask...
        if (currPermissionStatus === "default") {
            await Notification.requestPermission();
        }

        toast.promise(QueueAPI.createTicket(queueID, data.description, data.anonymize), {
            loading: "Creating ticket...",
            success: "Ticket created!",
            error: errors.UNKNOWN
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
                        variant="standard"
                    />
                </Stack>
                <FormControlLabel control={<Checkbox {...register("anonymize")}/>}
                                label="Hide your name from other students in the queue"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateTicketDialog;


