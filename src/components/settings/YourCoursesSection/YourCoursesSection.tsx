import React, {FC} from "react";
import {Box, List, ListItem, ListItemText, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import useCourses from "@util/course/hooks";
import {useSession} from "@util/auth/hooks";

export interface YourCoursesSectionProps {
}

/**
 * Write a short description of this component here...
 */
const YourCoursesSection: FC<YourCoursesSectionProps> = ({}) => {
    const {currentUser, loading} = useSession();
    const [courses, loadingCourses] = useCourses();

    if (loading || loadingCourses) {
        return <></>;
    }

    return (
        <Paper variant="outlined">
            <Box p={3}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>
                        Your Courses
                    </Typography>
                </Stack>

                {courses && <List>
                    {courses
                        .filter(course => currentUser?.coursePermissions && (currentUser.coursePermissions[course.id] != undefined))
                        .map(course => <ListItem
                            key={course.id}
                            disableGutters
                            secondaryAction={
                                <IconButton label="Delete course" edge="end" aria-label="delete">
                                    <DeleteIcon/>
                                </IconButton>
                            }>
                            <ListItemText
                                primary={`${course.code}: ${course.title}`}
                                secondary={course.term}
                            />
                        </ListItem>)}
                </List>}

            </Box>
        </Paper>
    );
};

export default YourCoursesSection;


