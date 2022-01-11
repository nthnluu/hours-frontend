import {useEffect, useState} from "react";
import {Course} from "@util/course/api";
import {collection, getFirestore, onSnapshot} from "@firebase/firestore";

export default function useCourses(): [Course[] | undefined, boolean] {
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