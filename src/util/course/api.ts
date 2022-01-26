import APIClient from "@util/APIClient";

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
        return await APIClient.get(`/courses/${courseID}`, {});
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a course with the given title, code, and term.
 */
async function createCourse(title: string, code: string, term: string): Promise<void> {
    try {
        await APIClient.post(`/courses/create`, {
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
        await APIClient.post(`/courses/${courseID}/edit`, {
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
        await APIClient.post(`/courses/${courseID}/addPermission`, {
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
        await APIClient.post(`/courses/${courseID}/removePermission`, {
            userID
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * 
 */
async function bulkUpload(term: string, data: string): Promise<void> {
    try {
        await APIClient.post(`/courses/bulkUpload`, {term, data});
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
    bulkUpload,
};


export default CourseAPI;