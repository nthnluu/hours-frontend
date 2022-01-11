import APIClient from "@util/APIClient";

const enum Endpoint {
    CREATE_COURSE = '/courses',
    GET_COURSE = '/courses'
}

const enum CoursePermission {
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
 * Gets a course with the given title, code, and term.
 */
 async function getCourse(id: string): Promise<Course> {
    try {
        return await APIClient.get(`${Endpoint.GET_COURSE}/${id}`, {});
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

const CourseAPI = {
    getCourse,
    createCourse,
};


export default CourseAPI;