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
    const filteredCourses = courses && courses.filter(course => currentUser?.coursePermissions && (currentUser.coursePermissions[course.id] === CoursePermission.CourseAdmin));

    return <SettingsSection taOnly title="Manage your courses" loading={loading || loadingCourses}>
        {filteredCourses && <List>
            {filteredCourses.map((course, index) => <CourseListItem key={course.id} course={course}
                                                                    isLastChild={index === (filteredCourses.length - 1)}/>)}
        </List>}
    </SettingsSection>;
};

export default YourCoursesSection;


