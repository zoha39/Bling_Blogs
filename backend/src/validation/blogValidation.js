const validateBlogData = ({ title, content }) => {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = "Blog title is required.";
  } else if (title.trim().length > 200) {
    errors.title = "Blog title cannot exceed 200 characters.";
  }

  if (!content || !content.trim()) {
    errors.content = "Blog content is required.";
  }

  return errors;
};

module.exports = {
  validateBlogData,
};
