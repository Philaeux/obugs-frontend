import { gql } from "apollo-angular";
import { Entry, EntryMessage, Vote, Software, Tag, User } from "../models";


export const QUERY_ENTRY_MESSAGES = gql`
    query EntryMessages($entryId: UUID!) {
        entryMessages(entryId: $entryId) {
            id
            entryId
            userId
            createdAt
            type
            comment
            stateBefore
            stateAfter
            ratingTotal
            ratingCount
            isClosed
            accepted
            closedById
            closedAt
        }
    }
`
export interface QueryResponseEntryMessages {
    entryMessages: EntryMessage[]
}

export const QUERY_LIST_SOFTWARE = gql`
    {
        softwares{
            id,
            fullName
            editor
            description
        }
    }
`
export interface QueryResponseListSoftware {
    softwares: Software[]
}

export const QUERY_CURRENT_USER = gql`
    {
        currentUser {
            id
            username
            isAdmin
            isBanned
        }
    }
`
export interface QueryResponseCurrentUser {
    currentUser: User
}

export const QUERY_USER_DETAILS = gql`
    query User($userId: UUID!) {
        user(userId: $userId) {
            id
            username
            isAdmin
            isBanned
        }
    }
`
export interface QueryResponseUserDetails {
    user: User
}

export const QUERY_LIST_TAGS = gql`
    query GetTags($softwareId: String!) {
        tags(softwareId: $softwareId) {
            id
            name
            softwareId
            fontColor
            backgroundColor
        }
    }
`
export interface QueryResponseListTags {
    tags: Tag[]
}

export const QUERY_MY_VOTE = gql`
    query MyVote($subjectId: UUID!) {
        myVote(subjectId: $subjectId) {
            subjectId
            userId
            rating
        }
    }
`;
export interface QueryResponseMyVote {
    myVote: Vote;
}

export const QUERY_ENTRY_DETAILS = gql`
    query Entry($entryId: UUID!){
        entry(entryId: $entryId) {
            id
            title
            softwareId
            description
            illustration
            tags{
                id
                name
                fontColor
                backgroundColor
            }
            createdAt
            updatedAt
            status
            ratingTotal
            ratingCount
        }
    }
`;
export interface QueryResponseEntryDetails {
    entry: Entry;
}

export const QUERY_LIST_ENTRIES = gql`
    query EntryList($softwareId: String!) {
        entries(softwareId: $softwareId) {
            id
            title
            softwareId
            description
            illustration
            tags{
                id
                name
                fontColor
                backgroundColor
            }
            createdAt
            updatedAt
            status
            ratingTotal
            ratingCount
        }
    }
`;
export interface QueryResponseListEntries {
    entries: Entry[];
}

