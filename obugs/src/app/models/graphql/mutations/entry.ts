import { gql } from "apollo-angular";
import { Entry, OBugsError } from "../../models";
import { ObugsFragments } from "../fragments";

export const MUTATION_CREATE_ENTRY = gql`
    mutation CreateEntry($recaptcha: String!, $softwareId: String!, $title: String!, $description: String!, $illustration: String!, $tags: [String!]!){
        createEntry(recaptcha: $recaptcha, softwareId: $softwareId, title:$title, description: $description, illustration: $illustration, tags: $tags) {
            __typename
            ... on OBugsError {
                message
            }
            ... on Entry {
                ...EntryFragment
            }
        }
    }
    ${ObugsFragments.fragments.entry}
`;
export interface MutationResponseCreateEntry {
    createEntry: OBugsError | Entry;
}


