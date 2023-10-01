import { gql } from "apollo-angular";
import { OBugsError, User } from "../../models";
import { ObugsFragments } from "../fragments";

export const MUTATION_BAN_USER = gql`
    mutation BanUser($userId: UUID!, $ban: Boolean!) {
        banUser(userId: $userId, ban: $ban){
            __typename
            ... on OBugsError {
                message
            }
            ... on User {
                ...UserFragment
            }
        }
    }
    ${ObugsFragments.fragments.user}
`
export interface MutationResponseBanUser {
    banUser: OBugsError | User
}
