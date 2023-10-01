import { gql } from "apollo-angular";
import { OBugsError, Software } from "../../models";
import { ObugsFragments } from "../fragments";

export const MUTATION_UPSERT_SOFTWARE = gql`
    mutation UpsertSoftware($id: String!, $fullName: String!, $editor: String!, $description: String!, $language: String!) {
        upsertSoftware(id: $id, fullName: $fullName, editor: $editor, description: $description, language: $language){
            __typename
            ... on OBugsError {
                message
            }
            ... on Software {
                ...SoftwareFragment
            }
        }
    }
    ${ObugsFragments.fragments.software}
`
export interface MutationResponseUpsertSoftware {
    upsertSoftware: OBugsError | Software
}
