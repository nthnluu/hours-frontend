import React, {FC, useState} from "react";
import CreateCourseDialog from "@components/settings/CreateCourseDialog";
import {Box, List, ListItem, ListItemText, Paper, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import useCourses from "@util/course/hooks";

export interface AllCoursesSectionProps {
}

/**
 * Write a short description of this component here...
 */
const AllCoursesSection: FC<AllCoursesSectionProps> = ({}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [courses, loading] = useCourses();

    return <>
        <CreateCourseDialog open={open} onClose={handleClose}/>
        <Paper variant="outlined">
            <Box p={3}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h5" fontWeight={600}>
                        All Courses
                    </Typography>

                    <Button variant="contained" onClick={handleOpen}>
                        New
                    </Button>
                </Stack>

                {courses && <List>
                    {courses.map(course => <ListItem
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
    </>;
};

export default AllCoursesSection;


