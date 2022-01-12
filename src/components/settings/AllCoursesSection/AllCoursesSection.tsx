import React, {FC, useState} from "react";
import CreateCourseDialog from "@components/settings/CreateCourseDialog";
import {Box, List, Paper, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import {useCourses} from "@util/course/hooks";
import CourseListItem from "../CourseListItem";

export interface AllCoursesSectionProps {
}

/**
 * Lists all courses.
 */
const AllCoursesSection: FC<AllCoursesSectionProps> = ({}) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [courses, loading] = useCourses();

    if (loading) return <></>;

    return <>
        <CreateCourseDialog open={openCreate} onClose={() => setOpenCreate(false)}/>
        <Paper variant="outlined">
            <Box p={3}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>
                        All Courses
                    </Typography>

                    <Button variant="contained" onClick={() => setOpenCreate(true)}>
                        New
                    </Button>
                </Stack>

                {courses && <List>
                    {courses.map(course => <CourseListItem key={course.id} course={course} />)}
                </List>}

            </Box>
        </Paper>
    </>;
};

export default AllCoursesSection;


