import { gql } from "apollo-angular";
import { Entry, EntryMessage, Error, ProcessPatchSuccess, VoteUpdate } from "../models";


export const MUTATION_VOTE = gql`
    mutation Vote($subjectId: UUID!, $rating: Int!) {
        vote(subjectId: $subjectId, rating: $rating) {
            __typename
            ... on Error {
                message
            }
            ... on VoteUpdate {
                ratingTotal
                ratingCount
            }
        }

    }
`
export interface MutationResponseVote {
    vote: Error | VoteUpdate
}

export const MUTATION_CREATE_ENTRY = gql`
    mutation CreateEntry($recaptcha: String!, $softwareId: String!, $title: String!, $description: String!, $illustration: String!, $tags: [String!]!){
        createEntry(recaptcha: $recaptcha, softwareId: $softwareId, title:$title, description: $description, illustration: $illustration, tags: $tags) {
            __typename
            ... on Error {
                message
            }
            ... on Entry {
                id
                softwareId
            }
        }
    }
`;
export interface MutationResponseCreatEntry {
    createEntry: Error | Entry;
}

export const MUTATION_COMMENT_ENTRY = gql`
    mutation CommentEntry($recaptcha: String!, $entryId: UUID!, $comment: String!) {
        commentEntry(recaptcha: $recaptcha, entryId: $entryId, comment: $comment) {
            __typename
            ... on Error {
                message
            }
            ... on EntryMessage {
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
    }
`
export interface MutationResponseCommentEntry {
    commentEntry: Error | EntryMessage;
}

export const MUTATION_SUBMIT_PATCH = gql`
    mutation SubmitPatch($recaptcha: String!, $entryId: UUID!, $title: String!, $status: String!, $tags: [String!]!, $description: String!, $illustration: String!) {
        submitPatch(recaptcha: $recaptcha, entryId: $entryId, title: $title, status: $status, tags: $tags, description: $description, illustration: $illustration) {
            __typename
            ... on Error {
                message
            }
            ... on EntryMessage {
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
    }
`
export interface MutationResponseSubmitPatch {
    submitPatch: Error | EntryMessage
}

export const MUTATION_PROCESS_PATCH = gql`
    mutation ProcessPatch($messageId: UUID!, $accept: Boolean!) {
        processPatch(messageId: $messageId, accept: $accept){
            __typename
            ... on Error {
                message
            }
            ... on ProcessPatchSuccess {
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
                entryMessage {
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
        }
    }
`

export interface MutationResponseProcessPatch {
    processPatch: Error | ProcessPatchSuccess
}
