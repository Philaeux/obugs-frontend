import { gql } from "apollo-angular";
import { Error, User } from "../../models";

export const MUTATION_BAN_USER = gql`
    mutation BanUser($userId: UUID!, $ban: Boolean!) {
        banUser(userId: $userId, ban: $ban){
            __typename
            ... on Error {
                message
            }
            ... on User {
                id
                username
                isAdmin
                isBanned
            }
        }
    }
`
export interface MutationresponseBanUser {
    banUser: Error | User
}
