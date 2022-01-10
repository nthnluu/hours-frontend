export interface Ticket {
    id: string;
    createdAt: string;
    name: string;
}

export interface Queue {
    id: string;
    courseTitle: string;
    queueTitle: string;
    color: string;
    description?: string;
    location: string;
    numTickets: number;
    tickets: Ticket[];
}