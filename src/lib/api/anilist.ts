import { GraphQLClient } from 'graphql-request'

const ANILIST_URL = 'https://graphql.anilist.co'
export const anilistClient = new GraphQLClient(ANILIST_URL)

export const TRENDING_MANGA_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: MANGA, sort: TRENDING_DESC, isAdult: false) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
        }
        averageScore
        chapters
        status
        genres
        description
      }
    }
  }
`

export const POPULAR_MANGA_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: MANGA, sort: POPULARITY_DESC, isAdult: false) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
        }
        averageScore
        chapters
        status
      }
    }
  }
`

export const MANGA_DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        color
      }
      bannerImage
      description
      averageScore
      popularity
      status
      chapters
      genres
      externalLinks {
        url
        site
      }
      staff(sort: RELEVANCE) {
        edges {
          role
          node {
            name {
              full
            }
          }
        }
      }
    }
  }
`

export const SEARCH_MANGA_QUERY = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: MANGA, isAdult: false) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
      }
    }
  }
`
