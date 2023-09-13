export interface AuthPayload {
    error: string;
    message: string;
}

export interface Software {
    id: string;
    fullName: string;
    editor: string;
}

export interface User {
    id: number;
    username: string;
}

export interface Tag {
    id: number;
    name: string;
    softwareId: string;
}

export interface Entry {
    id: number;
    softwareId: string;
    title: string;
    description: string;
    illustration: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    ratingTotal: number;
    ratingCount: number;
}

///////////////////

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
