import {FC, useState, useEffect} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem, FormControlLabel, Checkbox, FormGroup
} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, {CreateQueueRequest} from "@util/queue/api";
import CourseAPI, {Course} from "@util/course/api";
import {useSession} from "@util/auth/hooks";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export interface CreateCourseDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    title: string;
    description: string;
    location: string;
    courseID: string;
    allowTicketEditing: boolean;
    showMeetingLinks: boolean;
};

const CreateQueueDialog: FC<CreateCourseDialogProps> = ({open, onClose}) => {
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        // TODO(n-young): replace with the queue time once implemented
        const placeholderEndTime = new Date();
        placeholderEndTime.setMinutes(placeholderEndTime.getMinutes() + 30);
        const req: CreateQueueRequest = {...data, endTime: placeholderEndTime};
        toast.promise(QueueAPI.createQueue(req), {
            loading: "Creating queue...",
            success: "Queue created",
            error: errors.UNKNOWN,
        })
            .then(() => {
                reset();
                onClose();
            });
    });
    const {currentUser, loading} = useSession();
    const [coursePerms, setCoursePerms] = useState<Course[]>([]);

    useEffect(() => {
        if (currentUser && currentUser.coursePermissions)
            Promise.all(Object.keys(currentUser.coursePermissions)
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
                        variant="standard"
                    />
                    <TextField
                        {...register("location")}
                        required
                        label="Location"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                    <TextField
                        {...register("description")}
                        label="Description"
                        type="text"
                        fullWidth
                        size="small"
                        variant="standard"
                    />
                    <FormControl fullWidth size="small" variant="standard">
                        <InputLabel id="course-select-label">Course</InputLabel>
                        <Select
                            {...register("courseID")}
                            required
                            defaultValue={coursePerms.length > 0 ? coursePerms[0].id : ""}
                            fullWidth
                            labelId="course-select-label"
                            id="course-select"
                            label="Course"
                            type="text">
                            {coursePerms.map(x => <MenuItem key={x.id} value={x.id}>{x.title}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked {...register("allowTicketEditing")}/>}
                                          label="Allow students to edit their ticket"/>
                        <FormControlLabel control={<Checkbox {...register("showMeetingLinks")}/>}
                                          label="Provide Zoom link to students"/>
                    </FormGroup>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
        </form>
    </Dialog>;
};

export default CreateQueueDialog;


