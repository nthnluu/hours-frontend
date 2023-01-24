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
    pendingTickets: string[];
    completedTickets: string[];
    faceMaskPolicy: MaskPolicy;
    rejoinCooldown: number;
}

export const enum TicketStatus {
    StatusWaiting = "WAITING",
    StatusClaimed = "CLAIMED",
    StatusMissing = "MISSING",
    StatusComplete = "COMPLETE",
    StatusReturned = "RETURNED",
}

// Describes the possible mask policy options.
export const enum MaskPolicy {
    NoMaskPolicy,
    MasksRecommended,
    MasksRequired,
}

export interface TicketUserdata {
    UserID: string;
    Email: string;
    PhotoURL: string;
    DisplayName: string;
    Pronouns: string;
}

export interface Ticket {
    id: string;
    user: TicketUserdata;
    createdAt: Timestamp;
    completedAt?: Timestamp;
    claimedAt?: Timestamp;
    claimedBy?: string;
    status: TicketStatus;
    description: string;
    anonymize: boolean;
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
    faceMaskPolicy: MaskPolicy;
    rejoinCooldown: number;
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

export interface EditQueueRequest {
    queueID: string;
    title: string;
    description: string;
    location: string;
    endTime: Date;
    allowTicketEditing: boolean;
    showMeetingLinks: boolean;
    isCutOff: boolean;
    faceMaskPolicy: MaskPolicy;
    rejoinCooldown: number;
}

/**
 * Edits a queue.
 */
async function editQueue(req: EditQueueRequest): Promise<void> {
    try {
        await APIClient.post(`/queues/${req.queueID}/edit`, req);
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
 * Make an announcement to the users in a given queue, given a queueID.
 */
async function announceToQueue(queueID: string): Promise<void> {
    try {
        await APIClient.post(`/queues/${queueID}/announce`, {});
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
        await QueueAPI.editQueue({
            queueID: queue.id,
            title: queue.title,
            description: queue.description || "",
            endTime: new Date(),
            isCutOff: queue.isCutOff,
            allowTicketEditing: queue.allowTicketEditing,
            location: queue.location,
            showMeetingLinks: queue.showMeetingLinks,
            faceMaskPolicy: queue.faceMaskPolicy,
            rejoinCooldown: queue.rejoinCooldown,
        });
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
async function createTicket(queueID: string, description: string, anonymize: boolean): Promise<void> {
    try {
        await APIClient.post(`/queues/${queueID}/ticket`, {description, anonymize});
        return;
    } catch (e) {
        throw e;
    }
}

/**
 * Edits a ticket.
 */
async function editTicket(id: string, ownerID: string, queueID: string, status: TicketStatus, description: string): Promise<void> {
    try {
        await APIClient.patch(`/queues/${queueID}/ticket`, {
            id,
            ownerID,
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

/**
 * Deletes a ticket with the given ID.
 */
async function makeAnnouncement(queueID: string, announcement: string): Promise<void> {
    try {
        await APIClient.post(`/queues/${queueID}/announce`, {announcement});
        return;
    } catch (e) {
        throw e;
    }
}

const QueueAPI = {
    createQueue,
    editQueue,
    announceToQueue,
    cutOffQueue,
    deleteQueue,
    endQueue,
    shuffleQueue,
    createTicket,
    editTicket,
    deleteTicket,
    makeAnnouncement
};


export default QueueAPI;