import {useEffect, useState} from "react";
import {Queue} from "@util/queue/queue_helpers";
import {collection, getFirestore, onSnapshot} from "@firebase/firestore";

export default function useQueues(activeOnly: boolean): [Queue[] | undefined, boolean] {
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