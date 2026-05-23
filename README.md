# AniMe Raycast Extension

Discover anime with AniList GraphQL directly from Raycast.

AniMe does not use platform-specific APIs, so it is intended to work across Raycast's available platforms.

## First Run

AniMe asks two quick questions on first use:

- Whether you use Crunchyroll.
- Whether you prefer Gallery or List view. Gallery is the default and recommended option.

If Crunchyroll is enabled, AniMe opens Crunchyroll first when AniList provides a matching streaming link. AniList remains the fallback.

## Commands

- **Search Anime**: Search anime by title, filter optionally to Crunchyroll, and view details, cover art, airing status, episode counts, release date, next episode, studios, genres, score, and external links.
- **Current Season**: Browse anime currently airing in the local season and year, grouped by the weekday of their next episode.
- **Today's Episodes**: See episodes airing today using AniList airing schedules and local day timestamps.
- **Last 7 Days**: See episodes that aired during the last seven days, grouped by air date.
- **Watchlist**: View and remove anime saved locally with Raycast LocalStorage.

Every anime item includes streaming actions when AniList provides external links, plus a feedback action addressed to `esteban@damascuss.io`.

## Time Zones

AniList airing schedules return Unix timestamps. AniMe displays them using the machine's local time zone.
