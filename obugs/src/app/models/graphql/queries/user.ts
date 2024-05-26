import { gql } from "apollo-angular";
import { ApiError, User } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_CURRENT_USER = gql`
    {
        userCurrent {
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
`;
export interface QueryResponseCurrentUser {
    userCurrent: ApiError | User;
}

export const QUERY_USER_DETAILS = gql`
    query User($userId: UUID!) {
        user(userId: $userId) {
            ...UserFragment
        }
    }
    ${ObugsFragments.fragments.user}
`;
export interface QueryResponseUserDetails {
    user: User;
}

export const QUERY_USERS = gql`
    query Users($search: String) {
        users(search: $search) {
            ...UserFragment
        }
    }
    ${ObugsFragments.fragments.user}
`

export interface QueryResponseUsers {
    users: User[];
}