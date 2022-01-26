import {FC, useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    Stack,
    TextField,
    List,
    ListItem,
    ListItemText,
    FormControl,
    InputLabel,
    Select,
    MenuItem, Box, Tabs, Tab, Divider, Paper, Typography, LinearProgress
} from "@mui/material";
import Button from "@components/shared/Button";
import IconButton from "@components/shared/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {useForm} from "react-hook-form";
import CourseAPI, {Course} from "@util/course/api";
import {useInvitations} from "@util/course/hooks";
import {CoursePermission} from "@util/auth/api";
import {User} from "@util/auth/api";
import {toast} from "react-hot-toast";
import {useCourseStaff} from "@util/course/hooks";
import TabPanel from "@components/shared/TabPanel";
import errors from "@util/errors";

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

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const DialogButtons: FC = ({children}) => {
    return <Stack direction="row-reverse" justifyContent="end" spacing={1} mt={4}>
        {children}
    </Stack>;
};

const EditCourseDialog: FC<EditCourseDialogProps> = ({course, open, onClose}) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [editLoading, setEditLoading] = useState(false);
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [revokeAccessLoading, setRevokeAccessLoading] = useState(false);
    const [invites, loadingInvites] = useInvitations(course.id);

    // Edit form
    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        formState: {}
    } = useForm<EditFormData>();

    const onEditSubmit = handleEditSubmit(data => {
        setEditLoading(true);
        CourseAPI.editCourse(course.id, data.courseTitle, data.courseCode, data.term)
            .then(() => {
                toast.success("Course information updated successfully!");
                onClose();
                setEditLoading(false);
            })
            .catch(() => {
                toast.error(errors.UNKNOWN);
                setEditLoading(false);
            });
    });

    // Add permission form
    const {
        register: registerAddPermission,
        handleSubmit: handleAddPermissionSubmit,
        reset: resetAddPermission,
        formState: {}
    } = useForm<AddPermissionFormData>();

    const onAddPermissionSubmit = handleAddPermissionSubmit(data => {
        setAddMemberLoading(true);
        CourseAPI.addCoursePermission(course.id, data.email, data.permission)
            .then(() => {
                toast.success(`${data.email} has been added.`);
                resetAddPermission();
                setAddMemberLoading(false);
            })
            .catch(() => {
                toast.error(`User with email "${data.email}" not found.`);
                setAddMemberLoading(false);
            });
    });

    const [staff, loadingStaff] = useCourseStaff(course?.id);

    // Reset edit form when dialog is opened.
    useEffect(() => {
        if (open) {
            resetEdit();
        }
    }, [open, resetEdit]);

    function handleRevokeAccess(user: User) {
        const confirmed = confirm(`Are you sure you want to revoke ${user.displayName}'s (${user.email}) permissions?`);
        if (confirmed) {
            setRevokeAccessLoading(true);
            CourseAPI.removeCoursePermission(course.id, user.id)
                .then(() => {
                    toast.success(`${user.displayName} (${user.email}) removed.`);
                    setRevokeAccessLoading(false);
                })
                .catch(() => {
                    toast.error(errors.UNKNOWN);
                    setRevokeAccessLoading(false);
                });
        }
    }

    const loading = loadingStaff || editLoading || addMemberLoading || revokeAccessLoading;

    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <Box sx={{opacity: loading ? 100 : 0}}>
            <LinearProgress/>
        </Box>
        <DialogTitle>Course Settings</DialogTitle>
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} aria-label="course settings tabs"
                      centered
                      variant="fullWidth">
                    <Tab label="Course Info" {...a11yProps(0)} />
                    <Tab label="Manage Access" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={currentTab} index={0}>
                <form onSubmit={onEditSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            {...registerEdit("courseCode")}
                            defaultValue={course.code}
                            required
                            label="Course code"
                            type="text"
                            fullWidth
                            size="small"
                            variant="standard"
                        />
                        <TextField
                            {...registerEdit("courseTitle")}
                            defaultValue={course.title}
                            required
                            label="Course title"
                            type="text"
                            fullWidth
                            size="small"
                            variant="standard"
                        />
                        <TextField
                            {...registerEdit("term")}
                            defaultValue={course.term}
                            required
                            label="Term"
                            type="text"
                            fullWidth
                            size="small"
                            variant="standard"
                        />
                    </Stack>
                    <DialogButtons>
                        <Button type="submit" variant="contained" disabled={editLoading}>Save</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogButtons>
                </form>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <Paper variant="outlined" sx={{bgcolor: 'error'}}>
                    <Box maxHeight={300} overflow="auto">
                        <List dense>
                            {staff.map(user => (
                                <ListItem
                                    key={user.id}
                                    secondaryAction={
                                        <IconButton label="Revoke access" edge="end" aria-label="delete"
                                                    disabled={revokeAccessLoading}
                                                    onClick={() => handleRevokeAccess(user)}>
                                            <CloseIcon/>
                                        </IconButton>
                                    }>
                                    <ListItemText
                                        primary={`${user.displayName} (${user.coursePermissions[course.id] === CoursePermission.CourseAdmin ? "Admin" : "Staff"})`}
                                        secondary={user.email}
                                    />
                                </ListItem>))}
                            {invites.map(email => (
                                <ListItem key={email}>
                                    <ListItemText primary={"(pending)"} secondary={email}/>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>
                <Box my={2}>
                    <Divider/>
                </Box>
                <Typography variant="h6" mb={2}>Add member</Typography>
                <form onSubmit={onAddPermissionSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            {...registerAddPermission("email")}
                            required
                            label="Email"
                            type="email"
                            autoComplete="off"
                            fullWidth
                            size="small"
                            variant="standard"
                        />
                        <FormControl fullWidth size="small" variant="standard">
                            <InputLabel id="permission-label">Role</InputLabel>
                            <Select
                                {...registerAddPermission("permission")}
                                required
                                defaultValue={""}
                                fullWidth
                                labelId="permission-label"
                                id="permission"
                                label="Role"
                                type="text"
                            >
                                <MenuItem value={CoursePermission.CourseAdmin}>Admin</MenuItem>
                                <MenuItem value={CoursePermission.CourseStaff}>Staff</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <DialogButtons>
                        <Button type="submit" variant="contained" disabled={addMemberLoading}>Add member</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogButtons>
                </form>
            </TabPanel>
        </Box>
    </Dialog>;
};

export default EditCourseDialog;


