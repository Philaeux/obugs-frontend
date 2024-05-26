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

export interface SoftwareSuggestion {
    __typename: 'SoftwareSuggestion'
    id: string;
    name: string;
    description: string;
}

export interface User {
    __typename: 'User'
    id: string;
    githubId: number | null;
    githubName: string | null;
    redditId: string | null;
    redditName: string | null;
    isAdmin: boolean;
    isBanned: boolean;
    username: string;
    roles: {
        edges: {
            node: UserSoftwareRole
        }[]
    }
}

export interface UserSoftwareRole {
    __typename: 'UserSoftwareRole'
    softwareId: string;
    role: number;
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
    rating: number;
    ratingTotal: number;
    ratingCount: number;
    tags: {
        edges: {
            node: Tag
        }[]
    }
    openPatchesCount: number;
    commentCount: number;
}

export interface Vote {
    __typename: 'Vote'
    id: string;
    subjectId: string;
    userId: string;
    rating: number;
}

export interface OutputVote {
    __typename: 'OutputVote'
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
    entry: Entry
}

export interface ApiError {
    __typename: 'ApiError';
    message: string;
}

export interface ApiSuccess {
    __typename: 'ApiSuccess';
    message: boolean;
}

export interface ProcessPatchSuccess {
    __typename: 'ProcessPatchSuccess'
    entry: Entry,
    entryMessage: EntryMessage,
}
