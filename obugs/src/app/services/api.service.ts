import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { MUTATION_BAN_USER, MutationResponseBanUser } from '../models/graphql/mutations/user';
import { MUTATION_COMMENT_ENTRY, MUTATION_DELETE_MESSAGE, MUTATION_PROCESS_PATCH, MUTATION_SUBMIT_PATCH, MutationResponseCommentEntry, MutationResponseDeleteMessage, MutationResponseProcessPatch, MutationResponseSubmitPatch } from '../models/graphql/mutations/entry_message';
import { MUTATION_DELETE_SUGGESTION, MUTATION_SUGGEST_SOFTWARE, MUTATION_UPSERT_SOFTWARE, MutationResponseDeleteSuggestion, MutationResponseSuggestSoftware, MutationResponseUpsertSoftware } from '../models/graphql/mutations/software';
import { MUTATION_UPSERT_TAG, MutationResponseUpsertTag } from '../models/graphql/mutations/tag';
import { MUTATION_VOTE, MutationResponseVote } from '../models/graphql/mutations/vote';
import { QUERY_CURRENT_USER, QUERY_USER_DETAILS, QueryResponseCurrentUser, QueryResponseUserDetails } from '../models/graphql/queries/user';
import { QUERY_LIST_SOFTWARE, QUERY_LIST_SOFTWARE_SUGGESTIONS, QueryResponseListSoftware, QueryResponseListSoftwareSuggestions } from '../models/graphql/queries/software';
import { QUERY_LIST_TAGS, QueryResponseListTags } from '../models/graphql/queries/tag';
import { QUERY_MY_VOTE, QueryResponseMyVote } from '../models/graphql/queries/vote';
import { QUERY_ENTRY_MESSAGES, QUERY_PATCHES, QueryResponseEntryMessages, QueryResponsePatches } from '../models/graphql/queries/entry_message';
import { QUERY_ENTRY_DETAILS, QUERY_LIST_ENTRIES, QueryResponseEntryDetails, QueryResponseListEntries } from '../models/graphql/queries/entry';
import { MUTATION_CREATE_ENTRY, MutationResponseCreateEntry } from '../models/graphql/mutations/entry';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private apollo: Apollo
  ) { }

  entryAdd(recaptcha: string, softwareId: string, title: string, description: string, illustration: string, tags: string[]) {
    return this.apollo.mutate<MutationResponseCreateEntry>({
      mutation: MUTATION_CREATE_ENTRY,
      variables: {
        recaptcha: recaptcha,
        softwareId: softwareId,
        title: title,
        description: description,
        illustration: illustration,
        tags: tags
      }
    })
  }

  entryDetails(entryId: string) {
    return this.apollo.query<QueryResponseEntryDetails>({
      query: QUERY_ENTRY_DETAILS,
      variables: {
        entryId: entryId,
      }
    })
  }

  entryList(softwareId: string, searchFilter: string, statusFilter: string[], order: string, limit: number, offset: number) {
    return this.apollo.subscribe<QueryResponseListEntries>({
      query: QUERY_LIST_ENTRIES,
      variables: {
        softwareId: softwareId,
        searchFilter: searchFilter != '' ? searchFilter : null,
        statusFilter: statusFilter,
        order: order,
        limit: limit,
        offset: offset
      }
    })
  }

  messageAdd(recaptcha: string, entryId: string, comment: string) {
    return this.apollo.mutate<MutationResponseCommentEntry>({
      mutation: MUTATION_COMMENT_ENTRY,
      variables: {
        recaptcha: recaptcha,
        entryId: entryId,
        comment: comment
      }
    })
  }

  messageDelete(messageId: string) {
    return this.apollo.mutate<MutationResponseDeleteMessage>({
      mutation: MUTATION_DELETE_MESSAGE,
      variables: {
        messageId: messageId
      }
    })
  }

  messageList(entryId: string, limit: number, offset: number) {
    return this.apollo.query<QueryResponseEntryMessages>({
      query: QUERY_ENTRY_MESSAGES,
      variables: {
        entryId: entryId,
        limit: limit,
        offset: offset
      }
    })
  }

  patchAdd(recaptcha: string, entryId: string, title: string, status: string, tags: string[], description: string, illustration: string) {
    return this.apollo.mutate<MutationResponseSubmitPatch>({
      mutation: MUTATION_SUBMIT_PATCH,
      variables: {
        recaptcha: recaptcha,
        entryId: entryId,
        title: title,
        status: status,
        tags: tags,
        description: description,
        illustration: illustration
      }
    })
  }

  patchListOpen(softwareId: string | null = null) {
    return this.apollo.query<QueryResponsePatches>({
      query: QUERY_PATCHES,
      variables: {
        softwareId: softwareId != '' ? softwareId : null
      }
    })
  }

  patchProcess(patchId: string, accept: boolean) {
    return this.apollo.mutate<MutationResponseProcessPatch>({
      mutation: MUTATION_PROCESS_PATCH,
      variables: {
        messageId: patchId,
        accept: accept
      }
    })
  }

  softwareList(search: string) {
    return this.apollo.query<QueryResponseListSoftware>({
      query: QUERY_LIST_SOFTWARE,
      variables: {
        search: search != '' ? search : null
      }
    })
  }

  softwareSuggestionAdd(recaptcha: string, name: string, description: string) {
    return this.apollo.mutate<MutationResponseSuggestSoftware>({
      mutation: MUTATION_SUGGEST_SOFTWARE,
      variables: {
        recaptcha: recaptcha,
        name: name,
        description: description
      }
    })
  }

  softwareSuggestionList() {
    return this.apollo.query<QueryResponseListSoftwareSuggestions>({
      query: QUERY_LIST_SOFTWARE_SUGGESTIONS
    })
  }

  softwareSuggestionDelete(suggestionId: string) {
    return this.apollo.mutate<MutationResponseDeleteSuggestion>({
      mutation: MUTATION_DELETE_SUGGESTION,
      variables: {
        suggestionId: suggestionId
      }
    })
  }

  softwareUpsert(id: string, fullName: string, editor: string, language: string, description: string) {
    return this.apollo.mutate<MutationResponseUpsertSoftware>({
      mutation: MUTATION_UPSERT_SOFTWARE,
      variables: {
        id: id,
        fullName: fullName,
        editor: editor,
        language: language,
        description: description,
      }
    })
  }

  tagList(softwareId: string, search: string) {
    return this.apollo.query<QueryResponseListTags>({
      query: QUERY_LIST_TAGS,
      variables: {
        softwareId: softwareId,
        search: search != '' ? search : null
      }
    })
  }

  tagUpsert(id: string, softwareId: string, name: string, fontColor: string, backgroundColor: string) {
    return this.apollo.mutate<MutationResponseUpsertTag>({
      mutation: MUTATION_UPSERT_TAG,
      variables: {
        id: id != '' ? id : null,
        softwareId: softwareId,
        name: name,
        fontColor: fontColor,
        backgroundColor: backgroundColor
      }
    })
  }

  userBan(userId: string, ban: boolean) {
    return this.apollo.mutate<MutationResponseBanUser>({
      mutation: MUTATION_BAN_USER,
      variables: {
        userId: userId,
        ban: ban
      }
    })
  }

  userCurrent() {
    return this.apollo.query<QueryResponseCurrentUser>({
      query: QUERY_CURRENT_USER
    });
  }

  userDetails(userId: string) {
    return this.apollo.query<QueryResponseUserDetails>({
      query: QUERY_USER_DETAILS,
      variables: {
        userId: userId,
      }
    })
  }

  voteGet(subjectId: string) {
    return this.apollo.query<QueryResponseMyVote>({
      query: QUERY_MY_VOTE,
      variables: {
        subjectId: subjectId
      }
    })
  }

  voteSet(subjectId: string, rating: number) {
    return this.apollo.mutate<MutationResponseVote>({
      mutation: MUTATION_VOTE,
      variables: {
        subjectId: subjectId,
        rating: rating
      }
    })
  }

}
