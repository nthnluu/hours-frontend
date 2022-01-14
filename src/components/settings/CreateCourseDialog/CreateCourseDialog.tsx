import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import CourseAPI from "@util/course/api";

export interface CreateCourseDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    courseCode: string;
    courseTitle: string;
    term: string;
};

const CreateCourseDialog: FC<CreateCourseDialogProps> = ({open, onClose}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        CourseAPI.createCourse(data.courseTitle, data.courseCode, data.term);
        reset();
        onClose();
    });

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Add a new course</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...register("courseCode")}
                        required
                        autoFocus
                        label="Course code"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />

                    <TextField
                        {...register("courseTitle")}
                        required
                        label="Course title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />

                    <TextField
                        {...register("term")}
                        required
                        label="Term"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
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

export default CreateCourseDialog;


