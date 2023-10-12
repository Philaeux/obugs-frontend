import { gql } from "apollo-angular";
import { Entry } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_ENTRY_DETAILS = gql`
    query Entry($entryId: UUID!){
        entry(entryId: $entryId) {
            ...EntryFragment
        }
    }
    ${ObugsFragments.fragments.entry}
`;
export interface QueryResponseEntryDetails {
    entry: Entry;
}

export const QUERY_LIST_ENTRIES = gql`
    query EntryList($softwareId: String!, $searchFilter: String, $statusFilter: [String!]!, $order: String!, $limit: Int!, $offset: Int!) {
        entries(softwareId: $softwareId, searchFilter: $searchFilter, statusFilter: $statusFilter, order: $order, limit: $limit, offset: $offset) {
            ...EntryFragment
        }
    }
    ${ObugsFragments.fragments.entry}
`;
export interface QueryResponseListEntries {
    entries: Entry[];
}
