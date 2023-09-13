import { gql } from "apollo-angular"
import { Entry, Software, Tag, User } from "./models"


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

export const QUERY_LIST_TAGS = gql`
    query GetTags($softwareId: String!) {
        tags(softwareId: $softwareId) {
            id,
            name,
            softwareId
        }
    }
`

export interface QueryResponseListTags {
    tags: Tag[]
}

export const MUTATION_CREATE_ENTRY = gql`
    mutation CreateEntry($softwareId: String!, $title: String!, $description: String!, $illustration: String!, $tags: [String!]!){
        createEntry(softwareId: $softwareId, title:$title, description: $description, illustration: $illustration, tags: $tags) {
            id
            softwareId
        }
    }
`

export interface MutationResponseCreatEntry {
    createEntry: Entry
}

export const QUERY_ENTRY_DETAILS = gql`
    query Entry($entryId: Int!){
        entry(entryId: $entryId) {
            id
            title
            softwareId
            description
            illustration
            tags{
                id
                name
            }
            createdAt
            updatedAt
            status
            ratingTotal
            ratingCount
        }
    }
`

export interface QueryResponseEntryDetails {
    entry: Entry
}
