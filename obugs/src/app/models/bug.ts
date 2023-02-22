import { User } from "./user";

export interface BugNewPayload {
    error: string | null;
    payload: {
        id: number
    }
}

export interface Bug {
    id: number;
    title: string;
    description: string;
    user: User;
    status: String;
    rating_count: number;
    rating_total: number;
    created_at: string;
    updated_at: string;
}

export interface BugDetailsPayload {
    error: string | null;
    payload: Bug | null;
}

export interface BugVotePayload {
    error: string | null;
    payload: number | null;
}
