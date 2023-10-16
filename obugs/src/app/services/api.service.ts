import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { QUERY_LIST_TAGS, QueryResponseListTags } from '../models/graphql/queries/tag';
import { QUERY_PATCHES, QueryResponsePatches } from '../models/graphql/queries/entry_message';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private apollo: Apollo
  ) { }

  patchListOpen(softwareId: string | null = null) {
    return this.apollo.query<QueryResponsePatches>({
      query: QUERY_PATCHES,
      variables: {
        softwareId: softwareId != '' ? softwareId : null
      }
    })
  }

  tagList(softwareId: string, search: string | null = null) {
    return this.apollo.query<QueryResponseListTags>({
      query: QUERY_LIST_TAGS,
      variables: {
        softwareId: softwareId,
        search: search != '' ? search : null
      }
    })
  }
}
