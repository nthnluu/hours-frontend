import APIClient from "@util/APIClient";

const enum Endpoint {
    GET_COURSE = '/courses',
    CREATE_COURSE = '/courses/create',
    DELETE_COURSE = '/courses/delete',
    EDIT_COURSE = '/courses/edit',
    ADD_COURSE_PERMISSION = '/courses/addPermission',
    REMOVE_COURSE_PERMISSION = '/courses/removePermission',
}

export const enum CoursePermission {
    CourseAdmin = "ADMIN",
    CourseStaff = "STAFF"
}

export interface Course {
    id: string;
    title: string;
    code: string;
    term: string;
    coursePermissions: Map<string, CoursePermission>
}

/**
 * Gets a course with the given id.
 */
 async function getCourse(courseID: string): Promise<Course> {
    try {
        return await APIClient.get(`${Endpoint.GET_COURSE}/${courseID}`, {});
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a course with the given title, code, and term.
 */
async function createCourse(title: string, code: string, term: string): Promise<void> {
    try {
        await APIClient.post(Endpoint.CREATE_COURSE, {
            title, code, term
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Deletes a course with the given id.
 */
 async function deleteCourse(courseID: string): Promise<Course> {
    try {
        return await APIClient.post(`${Endpoint.DELETE_COURSE}/${courseID}`, {});
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a course with the given title, code, and term.
 */
async function editCourse(courseID: string, title: string, code: string, term: string): Promise<void> {
    try {
        await APIClient.post(`${Endpoint.EDIT_COURSE}/${courseID}`, {
            title, code, term
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a course with the given title, code, and term.
 */
async function addCoursePermission(courseID: string, email: string, permission: string): Promise<void> {
    try {
        await APIClient.post(`${Endpoint.ADD_COURSE_PERMISSION}/${courseID}`, {
            email, permission
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a course with the given title, code, and term.
 */
async function removeCoursePermission(courseID: string, userID: string): Promise<void> {
    try {
        await APIClient.post(`${Endpoint.REMOVE_COURSE_PERMISSION}/${courseID}`, {
            userID
        });
        return;
    } catch (e) {
        throw e;
    }
}

const CourseAPI = {
    getCourse,
    createCourse,
    deleteCourse,
    editCourse,
    addCoursePermission,
    removeCoursePermission,
};


export default CourseAPI;