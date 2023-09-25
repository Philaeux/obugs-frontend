import { gql } from "apollo-angular";
import { Entry, EntryMessage, VoteUpdate } from "../models";


export const MUTATION_VOTE = gql`
    mutation Vote($subjectId: UUID!, $rating: Int!) {
        vote(subjectId: $subjectId, rating: $rating) {
            ratingTotal
            ratingCount
        }

    }
`
export interface MutationResponseVote {
    vote: VoteUpdate
}

export const MUTATION_CREATE_ENTRY = gql`
    mutation CreateEntry($recaptcha: String!, $softwareId: String!, $title: String!, $description: String!, $illustration: String!, $tags: [String!]!){
        createEntry(recaptcha: $recaptcha, softwareId: $softwareId, title:$title, description: $description, illustration: $illustration, tags: $tags) {
            id
            softwareId
        }
    }
`;
export interface MutationResponseCreatEntry {
    createEntry: Entry;
}

export const MUTATION_COMMENT_ENTRY = gql`
    mutation CommentEntry($entryId: UUID!, $comment: String!) {
        commentEntry(entryId: $entryId, comment: $comment) {
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
export interface MutationResponseCommentEntry {
    commentEntry: EntryMessage[]
}

export const MUTATION_SUBMIT_PROPOSITION = gql`
    mutation SubmitProposition($entryId: UUID!, $title: String!, $status: String!, $tags: [String!]!, $description: String!, $illustration: String!) {
        submitProposition(entryId: $entryId, title: $title, status: $status, tags: $tags, description: $description, illustration: $illustration) {
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
export interface MutationResponseSubmitProposition {
    submitProposition: EntryMessage[]
}

export const MUTATION_PROCESS_PATCH = gql`
    mutation ProcessPatch($messageId: UUID!, $accept: Boolean!) {
        processPatch(messageId: $messageId, accept: $accept){
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
            message {
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
export interface MutationResponseProcessPatch {
    processPatch: {
        message: EntryMessage,
        entry: Entry
    }
}
