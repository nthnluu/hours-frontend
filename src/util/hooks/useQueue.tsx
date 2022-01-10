import {useEffect, useState} from "react";
import {Queue} from "@util/queue/queue_helpers";
import {doc, getFirestore, onSnapshot} from "@firebase/firestore";

export default function useQueue(id: string): [Queue | undefined, boolean] {
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