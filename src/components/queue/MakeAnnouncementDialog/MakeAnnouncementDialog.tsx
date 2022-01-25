import {FC, useEffect} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI from "@util/queue/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export interface MakeAnnouncementDialogProps {
    queueID: string;
    open: boolean;
    onClose: () => void;
}

type FormData = {
    announcement: string;
};

const MakeAnnouncementDialog: FC<MakeAnnouncementDialogProps> = ({queueID, open, onClose}) => {
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        toast.promise(QueueAPI.makeAnnouncement(queueID, data.announcement), {
            loading: "Sending announcement...",
            success: "Announcement sent!",
            error: errors.UNKNOWN
        })
            .then(() => {
                onClose();
                reset();
            });
    });

    useEffect(() => {
        reset();
    }, [reset, open]);

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <form onSubmit={onSubmit}>
            <DialogTitle>Make Announcement</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("announcement")}
                        multiline
                        required
                        label="Announcement"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Broadcast</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default MakeAnnouncementDialog;


