import { gql } from "apollo-angular";
import { Entry } from "../models";


export const MUTATION_VOTE_ON_ENTRY = gql`
    mutation VoteOnEntry($entryId: Int!, $rating: Int!) {
        voteOnEntry(entryId: $entryId, rating: $rating) {
            id
            title
            softwareId
            description
            illustration
            tags{
                id
                name
                fontColor
                backgroundColor
            }
            createdAt
            updatedAt
            status
            ratingTotal
            ratingCount
        }

    }
`
export interface MutationResponseVoteOnEntry {
    voteOnEntry: Entry
}

export const MUTATION_CREATE_ENTRY = gql`
    mutation CreateEntry($softwareId: String!, $title: String!, $description: String!, $illustration: String!, $tags: [String!]!){
        createEntry(softwareId: $softwareId, title:$title, description: $description, illustration: $illustration, tags: $tags) {
            id
            softwareId
        }
    }
`;
export interface MutationResponseCreatEntry {
    createEntry: Entry;
}

