import {useEffect, useState} from "react";
import {Course} from "@util/course/api";
import {collection, doc, getFirestore, onSnapshot} from "@firebase/firestore";
import AuthAPI, {User} from "@util/auth/api";

export function useCourses(): [Course[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        onSnapshot(collection(db, "courses"), (querySnapshot) => {
            const res: Course[] = [];
            querySnapshot.forEach((doc) => {
                res.push({id: doc.id, ...doc.data()} as Course);
            });

            setCourses(res);
            setLoading(false);
        });
    }, []);

    return [courses, loading];
}

export function useCourseStaff(courseID: string): [User[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        if (courseID) {
            const db = getFirestore();
            onSnapshot(doc(db, "courses", courseID), (doc) => {
                const staffIDs = Object.keys(doc.data()?.coursePermissions);
                Promise.all(staffIDs.map(staffID => AuthAPI.getUserById(staffID)))
                    .then(res => {
                        setStaff(res);
                        setLoading(false);
                    });
            });
        }
    }, [courseID]);

    return [staff, loading];
}