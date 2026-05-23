import { Grid, List } from "@raycast/api";
import { useCachedPromise, usePromise } from "@raycast/utils";
import { useState } from "react";

import { hasCrunchyrollLink, searchAnime } from "./anilist";
import { AnimeGridItem, AnimeListItem } from "./anime-components";
import { getAnimePreferences, Onboarding } from "./preferences";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: preferences, isLoading: isLoadingPreferences, revalidate } = useCachedPromise(getAnimePreferences);
  const query = searchText.trim();
  const { data = [], isLoading } = usePromise(searchAnime, [query], {
    execute: query.length > 0,
  });
  const filteredAnime = filter === "crunchyroll" ? data.filter(hasCrunchyrollLink) : data;

  if (!preferences) {
    if (!isLoadingPreferences) {
      return <Onboarding onComplete={revalidate} />;
    }

    return (
      <List isLoading searchBarPlaceholder="Loading preferences...">
        <List.EmptyView title="Loading Preferences..." />
      </List>
    );
  }

  if (preferences?.preferredView === "gallery") {
    return (
      <Grid
        isLoading={isLoading || isLoadingPreferences}
        searchBarPlaceholder="Search anime on AniList..."
        onSearchTextChange={setSearchText}
        searchBarAccessory={<GridFilterDropdown value={filter} onChange={setFilter} />}
        throttle
        columns={5}
        aspectRatio="2/3"
        fit={Grid.Fit.Fill}
      >
        {isLoading && filteredAnime.length === 0 ? (
          <Grid.EmptyView title="Loading Anime..." description="Fetching results from AniList." />
        ) : query.length === 0 ? (
          <Grid.EmptyView title="Search for Anime" description="Type a title to query AniList." />
        ) : (
          filteredAnime.map((anime) => (
            <AnimeGridItem key={anime.id} anime={anime} preferences={preferences} onPreferencesReset={revalidate} />
          ))
        )}
      </Grid>
    );
  }

  return (
    <List
      isLoading={isLoading || isLoadingPreferences}
      searchBarPlaceholder="Search anime on AniList..."
      onSearchTextChange={setSearchText}
      searchBarAccessory={<ListFilterDropdown value={filter} onChange={setFilter} />}
      throttle
    >
      {isLoading && filteredAnime.length === 0 ? (
        <List.EmptyView title="Loading Anime..." description="Fetching results from AniList." />
      ) : query.length === 0 ? (
        <List.EmptyView title="Search for Anime" description="Type a title to query AniList." />
      ) : (
        filteredAnime.map((anime) => (
          <AnimeListItem key={anime.id} anime={anime} preferences={preferences} onPreferencesReset={revalidate} />
        ))
      )}
    </List>
  );
}

function ListFilterDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <List.Dropdown tooltip="Streaming Filter" value={value} onChange={onChange}>
      <List.Dropdown.Item title="All Anime" value="all" />
      <List.Dropdown.Item title="Only On Crunchyroll" value="crunchyroll" />
    </List.Dropdown>
  );
}

function GridFilterDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Grid.Dropdown tooltip="Streaming Filter" value={value} onChange={onChange}>
      <Grid.Dropdown.Item title="All Anime" value="all" />
      <Grid.Dropdown.Item title="Only On Crunchyroll" value="crunchyroll" />
    </Grid.Dropdown>
  );
}
