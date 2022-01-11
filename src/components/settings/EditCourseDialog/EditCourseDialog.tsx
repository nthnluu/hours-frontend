import {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import CourseAPI, { Course } from "@util/course/api";

export interface EditCourseDialogProps {
    course: Course;
    open: boolean;
    onClose: () => void;
}

type FormData = {
    courseCode: string;
    courseTitle: string;
    term: string;
};

const EditCourseDialog: FC<EditCourseDialogProps> = ({course, open, onClose}) => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        CourseAPI.editCourse(course.id, data.courseTitle, data.courseCode, data.term);
        onClose();
    });


    console.log(course);

    if (!course) return <></>;

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit}>
            <DialogTitle>Edit {course.title}</DialogTitle>
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
                        variant="outlined"
                    />

                    <TextField
                        {...register("courseTitle")}
                        required
                        label="Course title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />

                    <TextField
                        {...register("term")}
                        required
                        label="Term"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Submit</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default EditCourseDialog;


