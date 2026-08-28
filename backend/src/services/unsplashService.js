const searchUnsplashImages = async (query, page = 1) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("Unsplash API key is not configured.");
  }

  const url = new URL("https://api.unsplash.com/search/photos");

  url.searchParams.set("query", query);
  url.searchParams.set("page", page);
  url.searchParams.set("per_page", 12);
  url.searchParams.set("content_filter", "high");

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Unsplash API request failed with status ${response.status}`,
    );
  }

  const data = await response.json();

  return {
    total: data.total,
    totalPages: data.total_pages,
    results: data.results.map((image) => ({
      id: image.id,
      url: image.urls.regular,
      smallUrl: image.urls.small,
      alt: image.alt_description || image.description || "Unsplash image",
      photographer: image.user.name,
      photographerUsername: image.user.username,
      unsplashUrl: image.links.html,
    })),
  };
};

module.exports = {
  searchUnsplashImages,
};
