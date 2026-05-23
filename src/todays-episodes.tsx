import { Grid, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

import { formatAiringClock, getAiringEpisodes, getLocalDayTimestamps } from "./anilist";
import { AnimeGridItem, AnimeListItem } from "./anime-components";
import { getAnimePreferences, Onboarding } from "./preferences";

export default function Command() {
  const { startTimestamp, endTimestamp } = getLocalDayTimestamps();
  const { data = [], isLoading } = useCachedPromise(getAiringEpisodes, [startTimestamp, endTimestamp]);
  const { data: preferences, isLoading: isLoadingPreferences, revalidate } = useCachedPromise(getAnimePreferences);

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
        searchBarPlaceholder="Filter today's episodes..."
        columns={5}
        aspectRatio="2/3"
        fit={Grid.Fit.Fill}
      >
        {isLoading && data.length === 0 ? (
          <Grid.EmptyView
            title="Loading Today's Episodes..."
            description="Fetching the airing schedule from AniList."
          />
        ) : (
          data.map((episode) => (
            <AnimeGridItem
              key={episode.id}
              anime={episode.media}
              preferences={preferences}
              onPreferencesReset={revalidate}
              subtitle={`Episode ${episode.episode} · ${formatAiringClock(episode.airingAt)}`}
            />
          ))
        )}
      </Grid>
    );
  }

  return (
    <List isLoading={isLoading || isLoadingPreferences} searchBarPlaceholder="Filter today's episodes...">
      {isLoading && data.length === 0 ? (
        <List.EmptyView title="Loading Today's Episodes..." description="Fetching the airing schedule from AniList." />
      ) : (
        data.map((episode) => (
          <AnimeListItem
            key={episode.id}
            anime={episode.media}
            preferences={preferences}
            onPreferencesReset={revalidate}
            subtitle={`Episode ${episode.episode} · ${formatAiringClock(episode.airingAt)}`}
          />
        ))
      )}
    </List>
  );
}
