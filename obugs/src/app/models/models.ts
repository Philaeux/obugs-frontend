export interface AuthPayload {
    error: string;
    message: string;
}

export interface Software {
    __typename: 'Software'
    id: string;
    fullName: string;
    editor: string;
    description: string;
    language: string;
}

export interface User {
    __typename: 'User'
    id: string;
    username: string;
    isAdmin: boolean;
    isBanned: boolean;
}

export interface Tag {
    __typename: 'Tag'
    id: string;
    name: string;
    softwareId: string;
    fontColor: string;
    backgroundColor: string;
}

export interface Entry {
    __typename: 'Entry'
    id: string;
    softwareId: string;
    title: string;
    description: string;
    illustration: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    ratingTotal: number;
    ratingCount: number;
    tags: Tag[]
}

export interface Vote {
    __typename: 'Vote'
    id: string;
    subjectId: string;
    userId: string;
    rating: number;
}

export interface VoteUpdate {
    __typename: 'VoteUpdate'
    ratingCount: number;
    ratingTotal: number;
}

export interface EntryMessage {
    __typename: 'EntryMessage'
    id: string;
    entryId: string;
    userId: string;
    createdAt: string;
    type: string;
    comment: string;
    stateBefore: string | null;
    stateAfter: string | null;
    ratingTotal: number | null;
    ratingCount: number | null;
    isClosed: boolean | null;
    accepted: boolean | null;
    closedById: string | null;
    closedAt: string;
}

export interface OBugsError {
    __typename: 'OBugsError';
    message: string;
}

export interface ProcessPatchSuccess {
    __typename: 'ProcessPatchSuccess'
    entry: Entry,
    entryMessage: EntryMessage,
}
