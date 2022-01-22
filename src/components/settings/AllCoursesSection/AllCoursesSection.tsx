import React, {FC, useState} from "react";
import CreateCourseDialog from "@components/settings/CreateCourseDialog";
import {List, Typography} from "@mui/material";
import {useCourses} from "@util/course/hooks";
import CourseListItem from "../CourseListItem";
import SettingsSection from "@components/settings/SettingsSection";

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
        <SettingsSection adminOnly title="All courses"
                         actionButton={{label: "New", onClick: () => setOpenCreate(true)}}>
            {courses && <List>
                {courses.length == 0 && <Typography textAlign="center">There are no courses.</Typography>}
                {courses.map((course, index) => <CourseListItem key={course.id} course={course}
                                                                isLastChild={index === (courses.length - 1)}/>)}
            </List>}
        </SettingsSection>
    </>;
};

export default AllCoursesSection;


