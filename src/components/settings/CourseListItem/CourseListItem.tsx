import React, {FC, useState} from "react";
import EditCourseDialog from "@components/settings/EditCourseDialog";
import {Box, Divider, ListItem, ListItemText} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ConfirmButton from "@components/shared/ConfirmButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CourseAPI, {Course} from "@util/course/api";

export interface CourseListItemProps {
    course: Course;
    isLastChild?: boolean;
}

const CourseListItem: FC<CourseListItemProps> = ({course, isLastChild}) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const handleCloseEdit = () => setOpenEdit(false);

    return (<>
        <EditCourseDialog course={course} open={openEdit} onClose={handleCloseEdit}/>
        <ListItem
            disableGutters
            secondaryAction={
                <>
                    <Box display="inline" mr={2}>
                        <IconButton label="Edit course" edge="end" aria-label="delete"
                                    onClick={() => setOpenEdit(true)}>
                            <EditIcon/>
                        </IconButton>
                    </Box>
                    <ConfirmButton
                        message={`Delete course ${course.title}?`}
                        open={openConfirm}
                        confirmButtonText="Delete course"
                        onClose={() => setOpenConfirm(false)}
                        onConfirm={() => CourseAPI.deleteCourse(course.id)}>
                        <IconButton label="Delete course" edge="end" aria-label="delete"
                                    onClick={() => setOpenConfirm(true)}>
                            <CloseIcon/>
                        </IconButton>
                    </ConfirmButton>
                </>
            }>
            <ListItemText
                primary={`${course.code}: ${course.title}`}
                secondary={course.term}
                primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                        marginRight: 3
                    }
                }}
            />
        </ListItem>
        {!isLastChild && <Divider/>}
    </>);
};

export default CourseListItem;


