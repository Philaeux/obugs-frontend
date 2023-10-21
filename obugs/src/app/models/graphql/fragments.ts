import { gql } from 'apollo-angular';

export const ObugsFragments = {
    fragments: {
        user: gql`
            fragment UserFragment on User {
                id
                githubId
                githubName
                isAdmin
                isBanned
                username
                roles {
                    edges {
                        node {
                            softwareId
                            role
                        }
                    }
                }
            }
        `,

        entry: gql`
            fragment EntryFragment on Entry {
                __typename
                id
                title
                softwareId
                description
                illustration
                tags {
                    edges {
                        node {
                            __typename
                            id
                            softwareId
                            name
                            fontColor
                            backgroundColor
                        }
                    }
                }
                createdAt
                updatedAt
                status
                rating
                ratingTotal
                ratingCount
                openPatchesCount
            }
        `,
        entryMessageCreation: gql`
            fragment EntryMessageCreationFragment on EntryMessageCreation {
                    __typename
                    id
                    entryId
                    userId
                    createdAt
                    type
                    stateAfter
            }
        `,
        entryMessageComment: gql`
            fragment EntryMessageCommentFragment on EntryMessageComment {
                    __typename
                    id
                    entryId
                    userId
                    createdAt
                    type
                    comment
            }
        `,
        entryMessagePatch: gql`
            fragment EntryMessagePatchFragment on EntryMessagePatch {
                    __typename
                    id
                    entryId
                    userId
                    createdAt
                    type
                    stateBefore
                    stateAfter
                    ratingTotal
                    ratingCount
                    isClosed
                    accepted
                    closedById
                    closedAt
            }
        `,
        software: gql`
            fragment SoftwareFragment on Software {
                id
                fullName
                editor
                description
                language
            }
        `,
        softwareSuggestion: gql`
            fragment SoftwareSuggestionFragment on SoftwareSuggestion {
                id
                name
                description
            }
        `,
        tag: gql`
            fragment TagFragment on Tag {
                id
                softwareId
                name
                fontColor
                backgroundColor
            }
        `,
        vote: gql`
            fragment VoteFragment on Vote {
                subjectId
                userId
                rating
            }
        `,
        voteUpdate: gql`
            fragment VoteUpdateFragment on VoteUpdate {
                ratingTotal
                ratingCount
            }
        `
    }
}
