import { gql } from "apollo-angular";
import { EntryMessage } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_ENTRY_MESSAGES = gql`
    query EntryMessages($entryId: UUID!, $limit: Int!, $offset: Int!) {
        entryMessages(entryId: $entryId, limit: $limit, offset: $offset) {
            ...EntryMessageCommentFragment
            ...EntryMessageCreationFragment
            ...EntryMessagePatchFragment
        }
    }
    ${ObugsFragments.fragments.entryMessageComment}
    ${ObugsFragments.fragments.entryMessageCreation}
    ${ObugsFragments.fragments.entryMessagePatch}
`;
export interface QueryResponseEntryMessages {
    entryMessages: EntryMessage[];
}

export const QUERY_PATCHES = gql`
    query Patches($softwareId: String) {
        openPatches(softwareId: $softwareId) {
            id
            createdAt
            ratingTotal
            ratingCount
            entry {
                id
                softwareId
            }
        }
    }
`;
export interface QueryResponsePatches {
    openPatches: EntryMessage[];
}
