import { gql } from "apollo-angular";
import { OBugsError, User } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_CURRENT_USER = gql`
    {
        currentUser {
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
`;
export interface QueryResponseCurrentUser {
    currentUser: OBugsError | User;
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
