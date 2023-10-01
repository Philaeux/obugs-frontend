import { gql } from 'apollo-angular';

export const ObugsFragments = {
    fragments: {

        user: gql`
            fragment UserFragment on User {
                id
                username
                isAdmin
                isBanned
            }
        `,

        entry: gql`
            fragment EntryFragment on Entry {
                id
                title
                softwareId
                description
                illustration
                tags {
                    id
                    softwareId
                    name
                    fontColor
                    backgroundColor
                }
                createdAt
                updatedAt
                status
                ratingTotal
                ratingCount
                openPatchesCount
            }
        `,
        entryMessage: gql`
            fragment EntryMessageFragment on EntryMessage {
                    id
                    entryId
                    userId
                    createdAt
                    type
                    comment
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
