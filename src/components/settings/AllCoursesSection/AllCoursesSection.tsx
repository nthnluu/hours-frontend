import React, {FC, useState} from "react";
import CreateCourseDialog from "@components/settings/CreateCourseDialog";
import EditCourseDialog from "@components/settings/EditCourseDialog";
import {Box, List, ListItem, ListItemText, Paper, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useCourses from "@util/course/hooks";
import CourseAPI, { Course } from "@util/course/api";

export interface AllCoursesSectionProps {
}

/**
 * Write a short description of this component here...
 */
const AllCoursesSection: FC<AllCoursesSectionProps> = ({}) => {
    const [openCreate, setOpenCreate] = useState(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const [course, setCourse] = useState<Course>();
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = (course: Course) => {
        setCourse(course);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => setOpenEdit(false);

    const [courses, loading] = useCourses();

    if (loading) return <></>;

    return <>
        <CreateCourseDialog open={openCreate} onClose={handleCloseCreate}/>
        <EditCourseDialog course={course!} open={openEdit} onClose={handleCloseEdit}/>
        <Paper variant="outlined">
            <Box p={3}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>
                        All Courses
                    </Typography>

                    <Button variant="contained" onClick={handleOpenCreate}>
                        New
                    </Button>
                </Stack>

                {courses && <List>
                    {courses.map(course => <ListItem
                        key={course.id}
                        disableGutters
                        secondaryAction={
                            <>
                            <IconButton label="Edit course" edge="end" aria-label="delete" onClick={() => handleOpenEdit(course)}>
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

export default AllCoursesSection;


