import {FC, useState, useEffect} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import Button from "@components/shared/Button";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {useForm} from "react-hook-form";
import CourseAPI, { Course, CoursePermission } from "@util/course/api";
import AuthAPI, { User } from "@util/auth/api";

export interface EditCourseDialogProps {
    course: Course;
    open: boolean;
    onClose: () => void;
}

type EditFormData = {
    courseCode: string;
    courseTitle: string;
    term: string;
};

type AddPermissionFormData = {
    email: string;
    permission: string;
};

const EditCourseDialog: FC<EditCourseDialogProps> = ({course, open, onClose}) => {
    const {register: registerEdit, handleSubmit: handleEditSubmit, formState: {errors: editErrors}} = useForm<EditFormData>();
    const onEditSubmit = handleEditSubmit(data => {
        CourseAPI.editCourse(course.id, data.courseTitle, data.courseCode, data.term);
        onClose();
    });

    const {register: registerAddPermission, handleSubmit: handleAddPermissionSubmit, formState: {errors: addPermissionErrors}} = useForm<AddPermissionFormData>();
    const onAddPermissionSubmit = handleAddPermissionSubmit(data => {
        CourseAPI.addCoursePermission(course.id, data.email, data.permission);
        onClose();
    });

    const [staff, setStaff] = useState<User[]>([]);
    useEffect(() => {
        if (course && course.coursePermissions)
            Promise.all(Object.keys(course.coursePermissions)
            .map(userID => AuthAPI.getUserById(userID)))
            .then(res => setStaff(res));
    }, [course, open]);

    if (!course) return <></>;

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onEditSubmit}>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...registerEdit("courseCode")}
                        required
                        autoFocus
                        label="Course code"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />

                    <TextField
                        {...registerEdit("courseTitle")}
                        required
                        label="Course title"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />

                    <TextField
                        {...registerEdit("term")}
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
        
        <form onSubmit={onAddPermissionSubmit}>
            <DialogTitle>Add Staff</DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <TextField
                        {...registerAddPermission("email")}
                        required
                        autoFocus
                        label="Email"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                    <FormControl fullWidth>
                        <InputLabel id="permission-label">Permission</InputLabel>
                        <Select
                            {...registerAddPermission("permission")}
                            required
                            defaultValue={""}
                            fullWidth
                            labelId="permission-label"
                            id="permission"
                            label="Permission"
                            type="text"
                            variant="outlined"
                        >   
                            <MenuItem value={CoursePermission.CourseAdmin}>HTA</MenuItem>
                            <MenuItem value={CoursePermission.CourseStaff}>UTA</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
        </form>

            <DialogTitle>Remove Staff</DialogTitle>
            <DialogContent>
                <List>
                {staff.map((user: User) => (
                        <ListItem
                            key={user.id + course.id}
                            disableGutters
                            secondaryAction={
                                <>
                                <IconButton label="Remove TA" edge="end" aria-label="delete" onClick={() => {
                                    CourseAPI.removeCoursePermission(course.id, user.id);
                                    setStaff(staff.filter(x => x.id != user.id));
                                }}>
                                    <DeleteIcon/>
                                </IconButton>
                                </>
                            }>
                        <ListItemText primary={user.email} secondary={user.displayName} />
                    </ListItem>))}
                </List>
            </DialogContent>
    </Dialog>;
};

export default EditCourseDialog;


