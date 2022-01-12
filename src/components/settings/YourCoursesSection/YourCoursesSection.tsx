import React, {FC} from "react";
import {Box, List, Paper, Stack, Typography} from "@mui/material";
import {useCourses} from "@util/course/hooks";
import {useSession} from "@util/auth/hooks";
import { CoursePermission } from "@util/auth/api";
import CourseListItem from "../CourseListItem";

export interface YourCoursesSectionProps {
}

/**
 * Lists your own courses.
 */
const YourCoursesSection: FC<YourCoursesSectionProps> = ({}) => {
    const {currentUser, loading} = useSession();
    const [courses, loadingCourses] = useCourses();

    if (loading || loadingCourses) return <></>;

    return (
        <Paper variant="outlined">
            <Box p={3}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>
                        Your Courses
                    </Typography>
                </Stack>

                {courses && <List>
                    {courses.filter(course => currentUser?.coursePermissions && (currentUser.coursePermissions[course.id] === CoursePermission.CourseAdmin))
                            .map(course => <CourseListItem key={course.id} course={course} />)}
                </List>}

            </Box>
        </Paper>
    );
};

export default YourCoursesSection;


