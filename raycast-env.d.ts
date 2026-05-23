/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-anime` command */
  export type SearchAnime = ExtensionPreferences & {}
  /** Preferences accessible in the `current-season` command */
  export type CurrentSeason = ExtensionPreferences & {}
  /** Preferences accessible in the `todays-episodes` command */
  export type TodaysEpisodes = ExtensionPreferences & {}
  /** Preferences accessible in the `last-7-days` command */
  export type Last7Days = ExtensionPreferences & {}
  /** Preferences accessible in the `watchlist` command */
  export type Watchlist = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-anime` command */
  export type SearchAnime = {}
  /** Arguments passed to the `current-season` command */
  export type CurrentSeason = {}
  /** Arguments passed to the `todays-episodes` command */
  export type TodaysEpisodes = {}
  /** Arguments passed to the `last-7-days` command */
  export type Last7Days = {}
  /** Arguments passed to the `watchlist` command */
  export type Watchlist = {}
}

