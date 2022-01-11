import {useEffect, useState} from "react";
import {Queue, Ticket} from "@util/queue/api";
import {collection, doc, Firestore, getFirestore, onSnapshot, query, where} from "@firebase/firestore";

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

    // todo impl active only
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

export function useTickets(queueID: string): [Ticket[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<Ticket[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();

        onSnapshot(collection(db, "queues", queueID, "tickets"), (querySnapshot) => {
            const res: Ticket[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                res.push({id: doc.id, ...data} as Ticket);
            });

            setTickets(res);
            setLoading(false);
        });
    }, [queueID]);

    return [tickets, loading];
}

