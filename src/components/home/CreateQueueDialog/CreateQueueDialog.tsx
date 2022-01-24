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
    MenuItem,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import Button from "@components/shared/Button";
import {useForm} from "react-hook-form";
import QueueAPI, {CreateQueueRequest} from "@util/queue/api";
import CourseAPI, {Course} from "@util/course/api";
import {useSession} from "@util/auth/hooks";
import {toast} from "react-hot-toast";
import errors from "@util/errors";
import {getNextHours} from "@util/shared/getNextHours";

export interface CreateCourseDialogProps {
    open: boolean;
    onClose: () => void;
}

type FormData = {
    title: string;
    description: string;
    location: string;
    courseID: string;
    endTimeIndex: number;
    allowTicketEditing: boolean;
    showMeetingLinks: boolean;
};

const CreateQueueDialog: FC<CreateCourseDialogProps> = ({open, onClose}) => {
    const times = getNextHours();
    const {register, handleSubmit, reset, formState: {}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        const req: CreateQueueRequest = { ...data, endTime: times[data.endTimeIndex].timestamp };
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
            <DialogTitle>Create Queue</DialogTitle>
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
                    <FormControl fullWidth size="small" variant="standard">
                        <InputLabel id="course-select-label" required>End time</InputLabel>
                        <Select
                            {...register("endTimeIndex")}
                            required
                            defaultValue={0}
                            fullWidth
                            labelId="time-select-label"
                            id="time-select"
                            label="End time"
                            type="text"
                        >
                            {times.map((time, i) => <MenuItem key={time.time} value={i}>{time.time}</MenuItem>)}
                        </Select>
                    </FormControl>
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
                            type="text"
                        >
                            {coursePerms.map(x => <MenuItem key={x.id} value={x.id}>{x.title}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControlLabel control={<Checkbox {...register("allowTicketEditing")}/>}
                                      label="Allow students to edit tickets once created"/>
                    <FormControlLabel control={<Checkbox {...register("showMeetingLinks")}/>}
                                      label="Show meeting links on claim"/>
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


