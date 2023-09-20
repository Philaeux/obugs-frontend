import { E } from "@angular/cdk/keycodes";

export interface AuthPayload {
    error: string;
    message: string;
}

export interface Software {
    id: string;
    fullName: string;
    editor: string;
    description: string;
}

export interface User {
    id: number;
    username: string;
}

export interface Tag {
    id: number;
    name: string;
    softwareId: string;
    fontColor: string;
    backgroundColor: string;
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
    tags: Tag[]
}

export interface EntryVote {
    entryId: number;
    userId: number;
    rating: number;
}

export interface EntryMessage {
    id: number;
    entryId: number;
    userId: number;
    createdAt: string;
    type: string;
    comment: string;
    stateBefore: string | null;
    stateAfter: string | null;
    rating: number | null;
    ratingCount: number | null;
}