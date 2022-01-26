import React, {FC, useState} from "react";
import CreateCourseDialog from "@components/settings/CreateCourseDialog";
import {List, Typography} from "@mui/material";
import {useCourses} from "@util/course/hooks";
import CourseListItem from "../CourseListItem";
import SettingsSection from "@components/settings/SettingsSection";
import BulkUploadDialog from "../BulkUploadDialog";

export interface AllCoursesSectionProps {
}

/**
 * Lists all courses.
 */
const AllCoursesSection: FC<AllCoursesSectionProps> = ({}) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [openBulk, setOpenBulk] = useState(false);
    const [courses, loading] = useCourses();

    if (loading) return <></>;

    return <>
        <CreateCourseDialog open={openCreate} onClose={() => setOpenCreate(false)}/>
        <BulkUploadDialog open={openBulk} onClose={() => setOpenBulk(false)}/>
        <SettingsSection adminOnly title="Manage all courses"
                         primaryActionButton={{label: "New", onClick: () => setOpenCreate(true)}}
                         secondaryActionButton={{label: "Bulk Upload", onClick: () => setOpenBulk(true)}}>
            {courses && <List>
                {courses.length == 0 && <Typography textAlign="center">There are no courses.</Typography>}
                {courses.map((course, index) => <CourseListItem key={course.id} course={course}
                                                                isLastChild={index === (courses.length - 1)}/>)}
            </List>}
        </SettingsSection>
    </>;
};

export default AllCoursesSection;


