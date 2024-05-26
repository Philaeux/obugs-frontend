import { gql } from "apollo-angular";
import { ApiError, User } from "../../models";
import { ObugsFragments } from "../fragments";

export const MUTATION_BAN_USER = gql`
    mutation BanUser($userId: UUID!, $ban: Boolean!) {
        banUser(userId: $userId, ban: $ban){
            __typename
            ... on ApiError {
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
    banUser: ApiError | User
}

export const MUTATION_USER_ROLE_CHANGE = gql`
    mutation ChangeRole($userId: UUID!, $softwareId: String!, $role: Int!, $setOn: Boolean!) {
        changeRole(userId: $userId, softwareId: $softwareId, role: $role, setOn: $setOn) {
            __typename
            ... on ApiError {
                message
            }
            ... on User {
                ...UserFragment
            }
        }
    }
    ${ObugsFragments.fragments.user}
`

export interface MutationResponseUserRoleChange {
    changeRole: ApiError | User
}