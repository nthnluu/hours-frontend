import APIClient from "@util/APIClient";
import {Course} from "@util/course/api";
import {Timestamp} from "@firebase/firestore";

export interface Queue {
    id: string;
    title: string;
    color: string;
    description?: string;
    course: Course;
    isCutOff: boolean;
    tickets: Ticket[];
}

export const enum TicketStatus {
	StatusWaiting = "WAITING",
	StatusClaimed = "CLAIMED",
	StatusMissing = "MISSING",
	StatusComplete = "COMPLETE",
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
    claimedAt: Timestamp;
    description: string;
    status: TicketStatus;
}

/**
 * Creates a queue with the given title, description, and course ID.
 */
async function createQueue(title: string, description: string, courseID: string): Promise<void> {
    try {
        await APIClient.post(`/queues/create/${courseID}`, {
            title, description, courseID
        });
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Creates a queue with the given title, description, and course ID.
 */
async function editQueue(queueID: string, title: string, description: string, isCutOff: boolean): Promise<void> {
    try {
        await APIClient.post(`/queues/${queueID}/edit`, {
            title, description, isCutOff 
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
 * Creates a queue with the given title, description, and course ID.
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
 * Creates a ticket for the given user.
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
 * Creates a ticket for the given user.
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
    shuffleQueue,
    createTicket,
    editTicket,
    deleteTicket
};


export default QueueAPI;