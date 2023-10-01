import { gql } from "apollo-angular";
import { EntryMessage } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_ENTRY_MESSAGES = gql`
    query EntryMessages($entryId: UUID!, $limit: Int!, $offset: Int!) {
        entryMessages(entryId: $entryId, limit: $limit, offset: $offset) {
            ...EntryMessageFragment
        }
    }
    ${ObugsFragments.fragments.entryMessage}
`;
export interface QueryResponseEntryMessages {
    entryMessages: EntryMessage[];
}
