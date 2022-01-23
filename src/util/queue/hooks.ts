import {useEffect, useState, useRef} from "react";
import {Announcement, Queue, Ticket, TicketStatus} from "@util/queue/api";
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

// Calls the callback cb when a _new_ announcement is detected.
// 
// This works by keeping a ref with the previously known number of announcements. We only run the 
// callback when the previously known number of announcements is non-null (i.e. numerically 
// defined) and the currently known number of announcements is greater than that.
// 
// Most of the logic in the effect is book-keeping to make sure this little dance happens.
export const useAnnouncements = (queue: Queue | undefined, cb: (a: Announcement) => void): void => {
    const prevAnnouncements = useRef<number | null>(null);

    useEffect(() => {
        const announcements = queue?.announcements ?? undefined;

        // If the queue doesn't exist yet, no need to run any logic.
        if (announcements === undefined) {
            return;
        }

        // If the prev is null, we're getting the announcements array for the first time.
        // We won't handle notifications on the first render, since that would lead to notifying
        // people about announcements that may have happened in the past.
        if (prevAnnouncements.current === null) {
            prevAnnouncements.current = announcements.length;
            return;
        }

        // However, if previous announcements is defined and its length is less than the number of
        // announcements we currently have, we can run the callback.
        if (prevAnnouncements.current < announcements.length) {
            // First, set prevAnnouncements to prevent race conditions of the effect firing multiple
            // times, between which the following line isn't called. Thus, we run this first before
            // calling cb.
            // 
            // (Consider the alternative case: we run the callbacks and then set prev.
            // An execution could be:
            //      1. Prev is 1
            //      2. We get 2 more announcements #2 and #3. So we run them.
            //      3. We get 2 _more_, #4 and #5. Step 2 hasn't set prev. So we run #2 through #5.
            //      4. Prev is set by 2 and 3, but the damage has already happened.
            //
            // This would be very hard to make happen, but you don't take cs1760 for naught.)
            prevAnnouncements.current = announcements.length;

            // Run the callback for all announcements starting at prevAnnouncements.current.
            for (let i = prevAnnouncements.current; i < announcements.length; i++) {
                cb(announcements[i]);
            }
        }
    }, [queue, cb]);
};

export function useQueues(activeOnly: boolean): [Queue[] | undefined, boolean] {
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
    }, [activeOnly]);

    return [queues, loading];
}

export function useTickets(queueID: string, filterCompleted: boolean): [Ticket[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<Ticket[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();

        const unsubscribe = onSnapshot(collection(db, "queues", queueID, "tickets"), (querySnapshot) => {
            let res: Ticket[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                res.push({id: doc.id, ...data} as Ticket);
            });

            if (filterCompleted) {
                res = res.filter(x => x.status != TicketStatus.StatusComplete);
            }

            setTickets(res);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [queueID, filterCompleted]);

    return [tickets, loading];
}

