import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadPost();
  }, [slug]);

  async function loadPost() {
    const data = await api(`/api/posts/${slug}`);
    setPost(data);
    const commentsData = await api(`/api/comments/${data._id}`);
    setComments(commentsData);
  }

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {post.author?.nickName} •{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="whitespace-pre-wrap">{post.body}</div>

      <hr className="my-6" />

      <h2 className="text-lg font-semibold mb-2">Comments</h2>
      {comments.map((c) => (
        <div key={c._id} className="border rounded-lg p-2 mb-2">
          <strong>{c.author?.nickName}:</strong> {c.body}
        </div>
      ))}
    </div>
  );
}
