import { Grid, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

import { AnimeGridItem, AnimeListItem } from "./anime-components";
import { getAnimePreferences, Onboarding } from "./preferences";
import { getWatchlist } from "./watchlist-storage";

export default function Command() {
  const { data = [], isLoading, revalidate } = useCachedPromise(getWatchlist);
  const {
    data: preferences,
    isLoading: isLoadingPreferences,
    revalidate: revalidatePreferences,
  } = useCachedPromise(getAnimePreferences);

  if (!preferences) {
    if (!isLoadingPreferences) {
      return <Onboarding onComplete={revalidatePreferences} />;
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
        searchBarPlaceholder="Filter watchlist..."
        columns={5}
        aspectRatio="2/3"
        fit={Grid.Fit.Fill}
      >
        {isLoading && data.length === 0 ? (
          <Grid.EmptyView title="Loading Watchlist..." />
        ) : data.length === 0 ? (
          <Grid.EmptyView
            title="Your Watchlist Is Empty"
            description="Save anime from Search Anime or Current Season."
          />
        ) : (
          data.map((anime) => (
            <AnimeGridItem
              key={anime.id}
              anime={anime}
              preferences={preferences}
              onPreferencesChange={revalidatePreferences}
              onWatchlistChange={revalidate}
              showRemoveFromWatchlist
            />
          ))
        )}
      </Grid>
    );
  }

  return (
    <List isLoading={isLoading || isLoadingPreferences} searchBarPlaceholder="Filter watchlist...">
      {isLoading && data.length === 0 ? (
        <List.EmptyView title="Loading Watchlist..." />
      ) : data.length === 0 ? (
        <List.EmptyView title="Your Watchlist Is Empty" description="Save anime from Search Anime or Current Season." />
      ) : (
        data.map((anime) => (
          <AnimeListItem
            key={anime.id}
            anime={anime}
            preferences={preferences}
            onPreferencesChange={revalidatePreferences}
            onWatchlistChange={revalidate}
            showRemoveFromWatchlist
          />
        ))
      )}
    </List>
  );
}
