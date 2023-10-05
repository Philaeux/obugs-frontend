import { gql } from "apollo-angular";
import { EntryMessage, OBugsError, ProcessPatchSuccess } from "../../models";
import { ObugsFragments } from "../fragments";

export const MUTATION_COMMENT_ENTRY = gql`
    mutation CommentEntry($recaptcha: String!, $entryId: UUID!, $comment: String!) {
        commentEntry(recaptcha: $recaptcha, entryId: $entryId, comment: $comment) {
            __typename
            ... on OBugsError {
                message
            }
            ... on EntryMessageComment {
                ...EntryMessageCommentFragment
            }
        }
    }
    ${ObugsFragments.fragments.entryMessageComment}
`
export interface MutationResponseCommentEntry {
    commentEntry: OBugsError | EntryMessage;
}

export const MUTATION_DELETE_MESSAGE = gql`
    mutation DeleteMessage($messageId: UUID!) {
        deleteMessage(messageId: $messageId){
            __typename
            ... on OBugsError {
                message
            }
            ... on MessageDeleteSuccess {
                success
            }
        }
    }
`
export interface MessageDeleteSuccess {
    __typename: "MessageDeleteSuccess"
    success: boolean;
}
export interface MutationResponseDeleteMessage {
    deleteMessage: OBugsError | MessageDeleteSuccess
}

export const MUTATION_SUBMIT_PATCH = gql`
    mutation SubmitPatch($recaptcha: String!, $entryId: UUID!, $title: String!, $status: String!, $tags: [String!]!, $description: String!, $illustration: String!) {
        submitPatch(recaptcha: $recaptcha, entryId: $entryId, title: $title, status: $status, tags: $tags, description: $description, illustration: $illustration) {
            __typename
            ... on OBugsError {
                message
            }
            ... on EntryMessagePatch {
                ...EntryMessagePatchFragment
            }
        }
    }
    ${ObugsFragments.fragments.entryMessagePatch}
`
export interface MutationResponseSubmitPatch {
    submitPatch: OBugsError | EntryMessage
}

export const MUTATION_PROCESS_PATCH = gql`
    mutation ProcessPatch($messageId: UUID!, $accept: Boolean!) {
        processPatch(messageId: $messageId, accept: $accept){
            __typename
            ... on OBugsError {
                message
            }
            ... on ProcessPatchSuccess {
                entry {
                    ...EntryFragment
                }
                entryMessage {
                    ...EntryMessagePatchFragment
                }
            }
        }
    }
    ${ObugsFragments.fragments.entry}
    ${ObugsFragments.fragments.entryMessagePatch}
`
export interface MutationResponseProcessPatch {
    processPatch: OBugsError | ProcessPatchSuccess
}
