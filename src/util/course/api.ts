import APIClient from "@util/APIClient";

// TODO: Figure out a better mechanism for prefixing, method usage
const enum Endpoint {
    GET_COURSE = '/',
    DELETE_COURSE = '/',
    CREATE_COURSE = '/create',
    EDIT_COURSE = '/edit',
    ADD_COURSE_PERMISSION = '/addPermission',
    REMOVE_COURSE_PERMISSION = '/removePermission',
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
    coursePermissions: { [key: string]: CoursePermission };
}

/**
 * Gets a course with the given id.
 */
 async function getCourse(courseID: string): Promise<Course> {
    try {
        return await APIClient.get(`/courses/${courseID}/${Endpoint.GET_COURSE}`, {});
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a course with the given title, code, and term.
 */
async function createCourse(title: string, code: string, term: string): Promise<void> {
    try {
        await APIClient.post(`/courses/${Endpoint.CREATE_COURSE}`, {
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
        return await APIClient.delete(`/courses/${courseID}`, {});
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a course with the given title, code, and term.
 */
async function editCourse(courseID: string, title: string, code: string, term: string): Promise<void> {
    try {
        await APIClient.post(`/courses/${courseID}/${Endpoint.EDIT_COURSE}`, {
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
        await APIClient.post(`/courses/${courseID}/${Endpoint.ADD_COURSE_PERMISSION}`, {
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
        await APIClient.post(`/courses/${courseID}/${Endpoint.REMOVE_COURSE_PERMISSION}`, {
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