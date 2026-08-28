const { searchUnsplashImages } = require("../services/unsplashService");

const searchImages = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    const page = Number(req.query.page) || 1;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please enter a search term.",
      });
    }

    if (query.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Search term is too long.",
      });
    }

    const results = await searchUnsplashImages(query, page);

    res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("Unsplash search error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to search Unsplash right now. Please try again.",
    });
  }
};

module.exports = {
  searchImages,
};
