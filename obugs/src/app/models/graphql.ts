import { gql } from "apollo-angular"
import { Entry, EntryMessage, EntryVote, Software, Tag, User } from "./models"


export const QUERY_LIST_SOFTWARE = gql`
    {
        softwares{
            id,
            fullName,
            editor,
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
            id,
            username
        }
    }
`

export interface QueryResponseCurrentUser {
    currentUser: User;
}

export const QUERY_LIST_TAGS = gql`
    query GetTags($softwareId: String!) {
        tags(softwareId: $softwareId) {
            id,
            name,
            softwareId
        }
    }
`

export interface QueryResponseListTags {
    tags: Tag[]
}

export const MUTATION_CREATE_ENTRY = gql`
    mutation CreateEntry($softwareId: String!, $title: String!, $description: String!, $illustration: String!, $tags: [String!]!){
        createEntry(softwareId: $softwareId, title:$title, description: $description, illustration: $illustration, tags: $tags) {
            id
            softwareId
        }
    }
`

export interface MutationResponseCreatEntry {
    createEntry: Entry
}

export const QUERY_ENTRY_DETAILS = gql`
    query Entry($entryId: Int!){
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
`

export interface QueryResponseEntryDetails {
    entry: Entry
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
`

export interface QueryResponseListEntries {
    entries: Entry[]
}

export const QUERY_MY_VOTE = gql`
    query MyVote($entryId: Int!) {
        myVote(entryId: $entryId) {
            entryId
            userId
            rating
        }
    }
`

export interface QueryResponseMyVote {
    myVote: EntryVote;
}

export const MUTATION_VOTE_ON_ENTRY = gql`
    mutation VoteOnEntry($entryId: Int!, $rating: Int!) {
        voteOnEntry(entryId: $entryId, rating: $rating) {
            entry {
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
            vote {
                entryId
                userId
                rating
            }
        }
    }
`

export interface MutationResponseVoteOnEntry {
    voteOnEntry: {
        entry: Entry,
        vote: EntryVote
    }
}

export const QUERY_ENTRY_MESSAGES = gql`
    query EntryMessages($entryId: Int!) {
        entryMessages(entryId: $entryId) {
            id
            entryId
            userId
            createdAt
            type
            stateBefore
            stateAfter
            rating
            ratingCount
        }
    }
`

export interface QueryResponseEntryMessages {
    entryMessages: EntryMessage[]
}