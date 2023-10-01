import { gql } from "apollo-angular";
import { Error, Tag } from "../../models";

export const MUTATION_UPSERT_TAG = gql`
    mutation UpsertTag($id: UUID, $softwareId: String!, $name: String!, $fontColor: String!, $backgroundColor: String!) {
        upsertTag(id: $id, softwareId: $softwareId, name: $name, fontColor: $fontColor, backgroundColor: $backgroundColor){
            __typename
            ... on Error {
                message
            }
            ... on Tag {
                id
                softwareId
                name
                fontColor
                backgroundColor
            }
        }
    }
`
export interface MutationResponseUpsertTag {
    upsertTag: Error | Tag
}
