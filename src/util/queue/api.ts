import APIClient from "@util/APIClient";
import {Course} from "@util/course/api";

const enum Endpoint {
    CREATE_QUEUE = '/queues/create',
    CREATE_TICKET = '/queues/ticket/create',
}

export interface Ticket {
    id: string;
    createdAt: Date;
    createdBy: {
        DisplayName: string
    };
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

const QueueAPI = {
    createQueue,
    createTicket
};


export default QueueAPI;