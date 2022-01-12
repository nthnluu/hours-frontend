import {FC, useState, useEffect} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Select, FormControl, InputLabel, MenuItem} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI from "@util/queue/api";
import CourseAPI, {Course} from "@util/course/api";
import {useSession} from "@util/auth/hooks";

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
    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        QueueAPI.createQueue(data.title, data.description, data.courseID);
        reset();
        onClose();
    });
    const {currentUser, loading} = useSession();
    const [coursePerms, setCoursePerms] = useState<Course[]>([]);

    useEffect(() => {
        if (currentUser)
            Promise.all(Object.keys(currentUser!.coursePermissions)
            .map(c => CourseAPI.getCourse(c)))
            .then(res => setCoursePerms(res));
    }, [currentUser]);

    if (loading) return <></>;

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

                    <FormControl fullWidth>
                        <InputLabel id="course-select-label">Course</InputLabel>
                        <Select
                            {...register("courseID")}
                            required
                            defaultValue={""}
                            fullWidth
                            labelId="course-select-label"
                            id="course-select"
                            label="Course"
                            type="text"
                            variant="outlined"
                        >   
                            {coursePerms.map(x => <MenuItem key={x.id} value={x.id}>{x.title}</MenuItem>)}
                        </Select>
                    </FormControl>
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


