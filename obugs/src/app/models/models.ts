export interface Software {
    id: string;
    fullname: string;
    editor: string;
}

export interface SoftwareArrayPayload {
    error: string | null;
    payload: Software[];
}

export interface SoftwarePayload {
    error: string | null;
    payload: Software | null;
}

export interface Bug {
    id: number;
    software_id: string;
    user_id: number;
    title: string;
    description: string;
    status: string;
    rating_count: number;
    rating_total: number;
    created_at: string;
    updated_at: string;
}

export interface BugArrayPayload {
    error: string | null;
    payload: Bug[];
}

///////////////////

export interface User {
    id: BigInteger;
    username: string;
}

export interface BugNewPayload {
    error: string | null;
    payload: {
        id: number
    }
}



export interface BugDetailsPayload {
    error: string | null;
    payload: Bug | null;
}

export interface BugVotePayload {
    error: string | null;
    payload: number | null;
}
