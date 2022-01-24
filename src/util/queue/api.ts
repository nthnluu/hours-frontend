import APIClient from "@util/APIClient";
import {Course} from "@util/course/api";
import {Timestamp} from "@firebase/firestore";

export interface Queue {
    id: string;
    title: string;
    color: string;
    description?: string;
    course: Course;
    location: string;
    endTime: Date;
    isCutOff: boolean;
    allowTicketEditing: boolean;
    showMeetingLinks: boolean;
    tickets: string[];
    announcements: Announcement[];
}

export interface Announcement {
    content: string;
}

export const enum TicketStatus {
    StatusWaiting = "WAITING",
    StatusClaimed = "CLAIMED",
    StatusMissing = "MISSING",
    StatusComplete = "COMPLETE",
    StatusReturned = "RETURNED",
}

export interface Ticket {
    id: string;
    createdAt: Timestamp;
    createdBy: {
        DisplayName: string;
        Email: string;
        IsAdmin: boolean;
        PhoneNumber: string;
        PhotoURL: string;
    };
    claimedAt?: Timestamp;
    description: string;
    status: TicketStatus;
}

/**
 * CreateQueueRequest is a parameter interface to the createQueue function.
 */
export interface CreateQueueRequest {
    title: string;
    description: string;
    location: string;
    endTime: Date;
    allowTicketEditing: boolean;
    showMeetingLinks: boolean;
    courseID: string;
}

/**
 * Creates a queue with the given title, description, and course ID.
 */
async function createQueue(req: CreateQueueRequest): Promise<void> {
    try {
        await APIClient.post(`/queues/create/${req.courseID}`, req);
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Edits a queue.
 */
async function editQueue(queueID: string, title: string, description: string, location: string, endTime: Date, isCutOff: boolean): Promise<void> {
    try {
        await APIClient.post(`/queues/${queueID}/edit`, {
            title, description, location, endTime, isCutOff
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Cutoff a queue, given a queueID.
 */
async function cutOffQueue(queueID: string, isCutOff: boolean): Promise<void> {
    try {
        await APIClient.patch(`/queues/${queueID}/cutoff`, {
            isCutOff
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Ends the given queue.
 */
async function endQueue(queue: Queue): Promise<void> {
    try {
        await QueueAPI.editQueue(queue.id, queue.title, queue.description || "", queue.location, new Date(), queue.isCutOff);
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Deletes a queue with the given queue ID.
 */
async function deleteQueue(queueID: string): Promise<void> {
    try {
        await APIClient.delete(`/queues/${queueID}`, {});
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Shuffles the tickets in a queue.
 */
async function shuffleQueue(queueID: string): Promise<void> {
    try {
        await APIClient.patch(`/queues/${queueID}/shuffle`);
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a ticket for the given user.
 */
async function createTicket(queueID: string, description: string): Promise<void> {
    try {
        await APIClient.post(`/queues/${queueID}/ticket`, {description});
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Edits a ticket.
 */
async function editTicket(id: string, queueID: string, status: TicketStatus, description: string): Promise<void> {
    try {
        await APIClient.patch(`/queues/${queueID}/ticket`, {
            id,
            status,
            description
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Deletes a ticket with the given ID.
 */
async function deleteTicket(id: string, queueID: string): Promise<void> {
    try {
        await APIClient.post(`/queues/${queueID}/ticket/delete`, {id});
        return;
    } catch (e) {
        throw e;
    }
}

const QueueAPI = {
    createQueue,
    editQueue,
    cutOffQueue,
    deleteQueue,
    endQueue,
    shuffleQueue,
    createTicket,
    editTicket,
    deleteTicket
};


export default QueueAPI;