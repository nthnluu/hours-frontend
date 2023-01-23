import {FC, useState} from "react";
import {
    Alert,
    Box,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";
import Button from "@components/shared/Button";
import MasksIcon from '@mui/icons-material/Masks';
import {useForm} from "react-hook-form";
import QueueAPI, {MaskPolicy} from "@util/queue/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export interface CreateTicketDialogProps {
    open: boolean;
    onClose: () => void;
    queueID: string;
    faceMaskPolicy: MaskPolicy;
}

type FormData = {
    description: string;
    anonymize: boolean;
};

const CreateTicketDialog: FC<CreateTicketDialogProps> = ({open, onClose, queueID, faceMaskPolicy}) => {
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = handleSubmit(async data => {
        setIsLoading(true);
        if ("Notification" in window) {
            // check for desktop notification permission
            const currPermissionStatus = Notification.permission;

            // user hasn't granted permission yet, ask...
            if (currPermissionStatus !== "denied" && currPermissionStatus === "default") {
                await Notification.requestPermission();
            }
        }

        toast.promise(QueueAPI.createTicket(queueID, data.description, data.anonymize), {
            loading: "Creating ticket...",
            success: "Ticket created!",
            error: errors.UNKNOWN
        })
            .then(() => {
                onClose();
                reset();
                setIsLoading(false);
            })
            .catch(() => {
                onClose();
                reset();
                setIsLoading(false);
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
                {faceMaskPolicy == MaskPolicy.MasksRecommended && <Box sx={{my: 2}}>
                    <Alert
                        icon={<MasksIcon fontSize="inherit"/>}
                        severity="info">
                        <strong>Face mask recommended.</strong> We suggest that you wear a face covering if you&apos;re
                        attending this section in person.
                    </Alert>
                </Box>}
                {faceMaskPolicy == MaskPolicy.MasksRequired && <Box sx={{my: 2}}>
                    <Alert
                        icon={<MasksIcon fontSize="inherit"/>}
                        severity="warning">
                        <strong>Face mask required.</strong> You must wear a face covering if attending this section in
                        person or you may be turned away.
                    </Alert>
                </Box>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" loading={isLoading}>Join</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateTicketDialog;


