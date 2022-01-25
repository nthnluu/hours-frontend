import {useEffect, useState} from "react";
import {getUserById} from "@util/auth/api";
import {Queue, SparseTicket, Ticket, TicketStatus} from "@util/queue/api";
import {collection, doc, getFirestore, onSnapshot, orderBy, query, Timestamp, where} from "@firebase/firestore";

export function useQueue(id: string): [Queue | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState<Queue | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(doc(db, "queues", id), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const endTime = data.endTime as Timestamp;
                setQueue({...data, id: id, endTime: endTime.toDate()} as Queue);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    return [queue, loading];
}

export function useQueues(): [Queue[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [queues, setQueues] = useState<Queue[] | undefined>(undefined);

    // todo impl active only
    useEffect(() => {
        const db = getFirestore();
        const dateThreshold = new Date();
        dateThreshold.setMinutes(dateThreshold.getMinutes() - 5);
        const q = query(collection(db, "queues"), where("endTime", ">=", dateThreshold), orderBy("endTime", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const res: Queue[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const endTime = data.endTime as Timestamp;
                res.push({...doc.data(), id: doc.id, endTime: endTime.toDate()} as Queue);
            });

            setQueues(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return [queues, loading];
}

export function useTickets(queueID: string, filterCompleted: boolean): [Ticket[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<Ticket[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();

        const unsubscribe = onSnapshot(collection(db, "queues", queueID, "tickets"), (querySnapshot) => {
            let res: SparseTicket[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                res.push({id: doc.id, ...data} as SparseTicket);
            });

            if (filterCompleted) {
                res = res.filter(x => x.status != TicketStatus.StatusComplete);
            }

            Promise.all(res.map(ticket => getUserById(ticket.userID)))
                .then(users => {
                    return users.map((user, i) => {
                        return {...res[i], createdBy: user};
                    });
                }).then(tickets => {
                    setTickets(tickets);
                    setLoading(false);
                });
        });

        return () => unsubscribe();
    }, [queueID, filterCompleted]);

    return [tickets, loading];
}

