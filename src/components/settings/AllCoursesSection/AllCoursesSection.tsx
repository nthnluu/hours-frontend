import React, {FC, useState} from "react";
import CreateCourseDialog from "@components/settings/CreateCourseDialog";
import {List} from "@mui/material";
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
        <SettingsSection adminOnly title="All courses" actionButton={{label: "New", onClick: () => setOpenCreate(true)}}>
            {courses && <List>
                {courses.map(course => <CourseListItem key={course.id} course={course}/>)}
            </List>}
        </SettingsSection>
    </>;
};

export default AllCoursesSection;


