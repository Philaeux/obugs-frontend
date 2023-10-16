import { gql } from "apollo-angular";
import { Tag } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_LIST_TAGS = gql`
    query GetTags($softwareId: String!, $search: String) {
        tags(softwareId: $softwareId, search: $search) {
            ...TagFragment
        }
    }
    ${ObugsFragments.fragments.tag}
`;
export interface QueryResponseListTags {
    tags: Tag[];
}
