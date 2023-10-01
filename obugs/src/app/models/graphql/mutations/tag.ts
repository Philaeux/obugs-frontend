import { gql } from "apollo-angular";
import { OBugsError, Tag } from "../../models";
import { ObugsFragments } from "../fragments";

export const MUTATION_UPSERT_TAG = gql`
    mutation UpsertTag($id: UUID, $softwareId: String!, $name: String!, $fontColor: String!, $backgroundColor: String!) {
        upsertTag(id: $id, softwareId: $softwareId, name: $name, fontColor: $fontColor, backgroundColor: $backgroundColor){
            __typename
            ... on OBugsError {
                message
            }
            ... on Tag {
                ...TagFragment
            }
        }
    }
    ${ObugsFragments.fragments.tag}
`
export interface MutationResponseUpsertTag {
    upsertTag: OBugsError | Tag
}
