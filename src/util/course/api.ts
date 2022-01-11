import APIClient from "@util/APIClient";

const enum Endpoint {
    CREATE_COURSE = '/courses',
}

export interface Course {
    id: string;
    title: string;
    code: string;
    term: string;
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
    createCourse
};


export default CourseAPI;