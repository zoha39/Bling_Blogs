import BlogCard from "./BlogCard";

export default function BlogList({ blogs }) {
  if (!blogs.length) {
    return (
      <div className="empty-state">
        <h2>No blogs yet</h2>
        <p>Be the first to share your story.</p>
      </div>
    );
  }

  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}
