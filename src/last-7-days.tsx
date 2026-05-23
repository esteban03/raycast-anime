import { Grid, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

import {
  AiringEpisode,
  formatAiringClock,
  formatAiringDay,
  getAiringEpisodes,
  getLastSevenDaysTimestamps,
} from "./anilist";
import { AnimeGridItem, AnimeListItem } from "./anime-components";
import { getAnimePreferences, Onboarding } from "./preferences";

export default function Command() {
  const { startTimestamp, endTimestamp } = getLastSevenDaysTimestamps();
  const { data = [], isLoading } = useCachedPromise(getAiringEpisodes, [startTimestamp, endTimestamp]);
  const { data: preferences, isLoading: isLoadingPreferences, revalidate } = useCachedPromise(getAnimePreferences);
  const sections = groupByAiringDay(data);

  if (!preferences) {
    if (!isLoadingPreferences) {
      return <Onboarding onComplete={revalidate} />;
    }

    return <List isLoading searchBarPlaceholder="Loading preferences..." />;
  }

  if (preferences.preferredView === "gallery") {
    return (
      <Grid
        isLoading={isLoading || isLoadingPreferences}
        searchBarPlaceholder="Filter episodes from the last 7 days..."
        columns={5}
        aspectRatio="2/3"
        fit={Grid.Fit.Fill}
      >
        {sections.map((section) => (
          <Grid.Section
            key={section.title}
            title={section.title}
            subtitle={formatSectionSubtitle(section.items.length)}
          >
            {section.items.map((episode) => (
              <AnimeGridItem
                key={episode.id}
                anime={episode.media}
                preferences={preferences}
                onPreferencesReset={revalidate}
                subtitle={`Episode ${episode.episode} · ${formatAiringClock(episode.airingAt)}`}
              />
            ))}
          </Grid.Section>
        ))}
      </Grid>
    );
  }

  return (
    <List isLoading={isLoading || isLoadingPreferences} searchBarPlaceholder="Filter episodes from the last 7 days...">
      {sections.map((section) => (
        <List.Section key={section.title} title={section.title} subtitle={formatSectionSubtitle(section.items.length)}>
          {section.items.map((episode) => (
            <AnimeListItem
              key={episode.id}
              anime={episode.media}
              preferences={preferences}
              onPreferencesReset={revalidate}
              subtitle={`Episode ${episode.episode} · ${formatAiringClock(episode.airingAt)}`}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

function groupByAiringDay(episodes: AiringEpisode[]) {
  const sortedEpisodes = [...episodes].sort((first, second) => second.airingAt - first.airingAt);
  const sections = new Map<string, AiringEpisode[]>();

  for (const episode of sortedEpisodes) {
    const title = formatAiringDay(episode.airingAt);
    sections.set(title, [...(sections.get(title) ?? []), episode]);
  }

  return Array.from(sections.entries()).map(([title, items]) => ({ title, items }));
}

function formatSectionSubtitle(count: number) {
  return `${count} ${count === 1 ? "episode" : "episodes"}`;
}
