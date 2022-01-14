import React, {FC} from "react";
import {List} from "@mui/material";
import {useCourses} from "@util/course/hooks";
import {useSession} from "@util/auth/hooks";
import {CoursePermission} from "@util/auth/api";
import CourseListItem from "../CourseListItem";
import SettingsSection from "@components/settings/SettingsSection";

export interface YourCoursesSectionProps {
}

/**
 * Lists courses in which you've been granted admin privileges.
 */
const YourCoursesSection: FC<YourCoursesSectionProps> = ({}) => {
    const {currentUser, loading} = useSession();
    const [courses, loadingCourses] = useCourses();

    return <SettingsSection title="Your courses" loading={loading || loadingCourses}>
        {courses && <List>
            {courses.filter(course => currentUser?.coursePermissions && (currentUser.coursePermissions[course.id] === CoursePermission.CourseAdmin))
                .map(course => <CourseListItem key={course.id} course={course}/>)}
        </List>}
    </SettingsSection>;
};

export default YourCoursesSection;


