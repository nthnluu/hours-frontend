import {useEffect, useState} from "react";
import {Queue} from "@util/queue/api";
import {collection, doc, getFirestore, onSnapshot} from "@firebase/firestore";

export function useQueue(id: string): [Queue | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState<Queue | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        onSnapshot(doc(db, "queues", id), (doc) => {
            setQueue(doc.data() as Queue);
            setLoading(false);
        });
    }, [id]);

    return [queue, loading];
}

export function useQueues(activeOnly: boolean): [Queue[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [queues, setQueues] = useState<Queue[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        onSnapshot(collection(db, "queues"), (querySnapshot) => {
            const res: Queue[] = [];
            querySnapshot.forEach((doc) => {
                res.push({id: doc.id, ...doc.data()} as Queue);
            });


            setQueues(res);
            setLoading(false);
        });
    }, [activeOnly]);

    return [queues, loading];
}