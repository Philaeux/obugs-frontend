import { gql } from "apollo-angular"
import { Software, User } from "./models"


export const QUERY_LIST_SOFTWARE = gql`
    {
        softwares{
            id,
            fullName,
            editor
        }
    }
`

export interface QueryResponseListSoftware {
    softwares: Software[]
}

export const QUERY_CURRENT_USER = gql`
    {
        currentUser {
            id,
            username
        }
    }
`

export interface QueryResponseCurrentUser {
    currentUser: User;
}
