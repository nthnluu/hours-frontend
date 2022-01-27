import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import CourseAPI from "@util/course/api";

export interface BulkUploadDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    term: string;
    data: string;
};

const BulkUploadDialog: FC<BulkUploadDialogProps> = ({open, onClose}) => {
    const {register, handleSubmit, reset} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        CourseAPI.bulkUpload(data.term, data.data);
        reset();
        onClose();
    });

    const rows = [
        "This is a dangerous operation. Only proceed if you know what you're doing.",
        "Paste comma-separated values in the data field with the following schema: (email, [UTA/HTA], course_code, course_name).",
        "Rows with invalid emails or any staff option that isn't 'UTA' or 'HTA' will be dropped. If a course_code maps to multiple different non-empty course_names, an arbitrary one will be chosen.",
        "If you use a previously used term name, unexpected behaviour may ensue.",
        "If the request fails, please double-check your data."
    ];

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Bulk Upload</DialogTitle>
            <DialogContent>
                {rows.map((row: string) => <Typography style={{display: "inline-block", marginBottom: "10px"}}
                                                       key={row}>{row}</Typography>)}
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("term")}
                        required
                        label="Term"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                    <TextField
                        {...register("data")}
                        required
                        autoFocus
                        label="CSV Data"
                        type="textarea"
                        fullWidth
                        multiline
                        rows={8}
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

export default BulkUploadDialog;


