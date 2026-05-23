import { Grid, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useState } from "react";

import {
  Anime,
  formatAiringClock,
  formatWeekday,
  getCurrentAnimeSeason,
  getCurrentSeasonAnime,
  hasCrunchyrollLink,
} from "./anilist";
import { AnimeGridItem, AnimeListItem } from "./anime-components";
import { getAnimePreferences, Onboarding } from "./preferences";

export default function Command() {
  const [filter, setFilter] = useState("all");
  const { season, year } = getCurrentAnimeSeason();
  const { data = [], isLoading } = useCachedPromise(getCurrentSeasonAnime, [season, year]);
  const { data: preferences, isLoading: isLoadingPreferences, revalidate } = useCachedPromise(getAnimePreferences);
  const filteredAnime = filter === "crunchyroll" ? data.filter(hasCrunchyrollLink) : data;
  const sections = groupByAiringDay(filteredAnime);

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
        searchBarPlaceholder={`Filter ${season.toLowerCase()} ${year}...`}
        searchBarAccessory={<GridFilterDropdown value={filter} onChange={setFilter} />}
        columns={5}
        aspectRatio="2/3"
        fit={Grid.Fit.Fill}
      >
        {isLoading && sections.length === 0 ? (
          <Grid.EmptyView title="Loading Current Season..." description="Fetching airing anime from AniList." />
        ) : (
          sections.map((section) => (
            <Grid.Section
              key={section.title}
              title={formatSectionTitle(section.title)}
              subtitle={formatSectionSubtitle(section.items.length)}
            >
              {section.items.map((anime) => (
                <AnimeGridItem
                  key={anime.id}
                  anime={anime}
                  preferences={preferences}
                  onPreferencesReset={revalidate}
                  subtitle={
                    anime.nextAiringEpisode ? formatAiringClock(anime.nextAiringEpisode.airingAt) : "Schedule Unknown"
                  }
                />
              ))}
            </Grid.Section>
          ))
        )}
      </Grid>
    );
  }

  return (
    <List
      isLoading={isLoading || isLoadingPreferences}
      searchBarPlaceholder={`Filter ${season.toLowerCase()} ${year}...`}
      searchBarAccessory={<ListFilterDropdown value={filter} onChange={setFilter} />}
    >
      {isLoading && sections.length === 0 ? (
        <List.EmptyView title="Loading Current Season..." description="Fetching airing anime from AniList." />
      ) : (
        sections.map((section) => (
          <List.Section
            key={section.title}
            title={formatSectionTitle(section.title)}
            subtitle={formatSectionSubtitle(section.items.length)}
          >
            {section.items.map((anime) => (
              <AnimeListItem
                key={anime.id}
                anime={anime}
                preferences={preferences}
                onPreferencesReset={revalidate}
                subtitle={
                  anime.nextAiringEpisode ? `Airs at ${formatAiringClock(anime.nextAiringEpisode.airingAt)}` : undefined
                }
              />
            ))}
          </List.Section>
        ))
      )}
    </List>
  );
}

function formatSectionTitle(title: string) {
  return title === "Schedule Unknown" ? title.toUpperCase() : `AIRING ${title.toUpperCase()}`;
}

function formatSectionSubtitle(count: number) {
  return `${count} ${count === 1 ? "show" : "shows"}`;
}

function groupByAiringDay(anime: Anime[]) {
  const sortedAnime = [...anime].sort((first, second) => {
    const firstAiring = first.nextAiringEpisode?.airingAt ?? Number.MAX_SAFE_INTEGER;
    const secondAiring = second.nextAiringEpisode?.airingAt ?? Number.MAX_SAFE_INTEGER;
    return firstAiring - secondAiring;
  });
  const sections = new Map<string, Anime[]>();

  for (const item of sortedAnime) {
    const title = formatWeekday(item.nextAiringEpisode?.airingAt);
    sections.set(title, [...(sections.get(title) ?? []), item]);
  }

  return Array.from(sections.entries()).map(([title, items]) => ({ title, items }));
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
