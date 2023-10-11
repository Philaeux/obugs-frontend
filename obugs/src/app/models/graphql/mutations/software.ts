import { gql } from "apollo-angular";
import { OBugsError, OperationDone, Software, SoftwareSuggestion } from "../../models";
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

export const MUTATION_SUGGEST_SOFTWARE = gql`
    mutation SuggestSoftware($recaptcha: String!, $name: String!, $description: String!) {
        suggestSoftware(recaptcha: $recaptcha, name: $name, description: $description) {
            __typename
            ... on OBugsError {
                message
            }
            ... on SoftwareSuggestion {
                ...SoftwareSuggestionFragment
            }
        }
    }
    ${ObugsFragments.fragments.softwareSuggestion}
`
export interface MutationResponseSuggestSoftware {
    suggestSoftware: OBugsError | SoftwareSuggestion
}

export const MUTATION_DELETE_SUGGESTION = gql`
    mutation DeleteSuggestion($suggestionId: UUID!) {
        deleteSuggestion(suggestionId: $suggestionId){
            __typename
            ... on OBugsError {
                message
            }
            ... on OperationDone {
                success
            }
        }
    }
`
export interface MutationResponseDeleteSuggestion {
    deleteSuggestion: OBugsError | OperationDone
}
