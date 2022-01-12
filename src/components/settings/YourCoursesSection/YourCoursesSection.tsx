import React, {FC, useState} from "react";
import EditCourseDialog from "@components/settings/EditCourseDialog";
import {Box, List, ListItem, ListItemText, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useCourses from "@util/course/hooks";
import {useSession} from "@util/auth/hooks";
import CourseAPI, { Course } from "@util/course/api";
import { CoursePermission } from "@util/auth/api";

export interface YourCoursesSectionProps {
}

/**
 * Write a short description of this component here...
 */
const YourCoursesSection: FC<YourCoursesSectionProps> = ({}) => {
    const {currentUser, loading} = useSession();
    const [courses, loadingCourses] = useCourses();

    const [course, setCourse] = useState<Course>();
    const [open, setOpen] = useState(false);
    const handleOpen = (course: Course) => {
        setCourse(course);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    if (loading || loadingCourses) {
        return <></>;
    }

    return <>
        <EditCourseDialog course={course!} open={open} onClose={handleClose}/>
        <Paper variant="outlined">
            <Box p={3}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>
                        Your Courses
                    </Typography>
                </Stack>

                {courses && <List>
                    {courses
                        .filter(course => currentUser?.coursePermissions && (currentUser.coursePermissions[course.id] != CoursePermission.CourseAdmin))
                        .map(course => <ListItem
                            key={course.id}
                            disableGutters
                            secondaryAction={
                                <>
                                <IconButton label="Edit course" edge="end" aria-label="delete" onClick={() => handleOpen(course)}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton label="Delete course" edge="end" aria-label="delete" onClick={() => CourseAPI.deleteCourse(course.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                                </>
                            }>
                            <ListItemText
                                primary={`${course.code}: ${course.title}`}
                                secondary={course.term}
                            />
                        </ListItem>)}
                </List>}

            </Box>
        </Paper>
    </>;
};

export default YourCoursesSection;


