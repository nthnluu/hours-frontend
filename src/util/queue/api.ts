import APIClient from "@util/APIClient";
import {Course} from "@util/course/api";

const enum Endpoint {
    CREATE_QUEUE = '/queues/create',
    CREATE_TICKET = '/queues/ticket/create',
    EDIT_TICKET = '/queues/ticket/edit',
    DELETE_TICKET = '/queues/ticket/delete',
}

export const enum TicketStatus {
	StatusWaiting = "WAITING",
	StatusClaimed = "CLAIMED",
	StatusMissing = "MISSING",
	StatusComplete = "COMPLETE",
}

export interface Ticket {
    id: string;
    createdAt: Date;
    createdBy: {
        DisplayName: string;
        Email: string;
        IsAdmin: boolean;
        PhoneNumber: string;
        PhotoUrl: string;
    };
    description: string;
}

export interface Queue {
    id: string;
    title: string;
    color: string;
    description?: string;
    course: Course;
    location: string;
    numTickets: number;
    tickets: Ticket[];
}

/**
 * Creates a queue with the given title, description, and course ID.
 */
async function createQueue(title: string, description: string, courseID: string): Promise<void> {
    try {
        await APIClient.post(Endpoint.CREATE_QUEUE, {
            title, description, courseID
        });
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
        await APIClient.post(`${Endpoint.CREATE_TICKET}/${queueID}`, {description});
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
        await APIClient.post(`${Endpoint.EDIT_TICKET}/${queueID}`, {
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
        await APIClient.post(`${Endpoint.DELETE_TICKET}/${queueID}`, {id});
        return;
    } catch (e) {
        throw e;
    }
}

const QueueAPI = {
    createQueue,
    createTicket,
    editTicket,
    deleteTicket
};


export default QueueAPI;