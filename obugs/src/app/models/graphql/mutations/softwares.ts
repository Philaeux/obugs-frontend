import { gql } from "apollo-angular";
import { Error, Software } from "../../models";

export const MUTATION_UPSERT_SOFTWARE = gql`
    mutation UpsertSoftware($id: String!, $fullName: String!, $editor: String!, $description: String!, $language: String!) {
        upsertSoftware(id: $id, fullName: $fullName, editor: $editor, description: $description, language: $language){
            __typename
            ... on Error {
                message
            }
            ... on Software {
                id
                fullName
                editor
                description
                language
            }
        }
    }
`
export interface MutationResponseUpsertSoftware {
    upsertSoftware: Error | Software
}
