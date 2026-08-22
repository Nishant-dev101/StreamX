import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../services/tweet.service";
import Loading from "../components/loading";
import Error from "../components/error";
import { PALETTE, TYPOGRAPHY } from "../utils/styles";

const UpdateTweets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTweets = async () => {
    try {
      const response = await getUserTweets();
      setTweets(response?.data?.data || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load your tweets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return undefined;
    const request = Promise.resolve().then(loadTweets);
    return () => request.catch(() => {});
  }, [user?._id]);

  const publish = async (event) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Tweet content cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const response = await createTweet(trimmedContent);
      const newTweet = response?.data?.data;
      if (newTweet) setTweets((current) => [newTweet, ...current]);
      setContent("");
      setMessage("Tweet posted successfully.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to post tweet.");
    } finally {
      setSubmitting(false);
    }
  };

  const save = async (tweetId) => {
    const trimmedContent = editingContent.trim();
    if (!trimmedContent) {
      setError("Tweet content cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await updateTweet(tweetId, trimmedContent);
      const updatedTweet = response?.data?.data;
      setTweets((current) =>
        current.map((tweet) =>
          tweet._id === tweetId
            ? { ...tweet, ...(updatedTweet || { content: trimmedContent }) }
            : tweet,
        ),
      );
      setEditingId(null);
      setEditingContent("");
      setMessage("Tweet updated.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to update tweet.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (tweetId) => {
    if (!window.confirm("Delete this tweet?")) return;

    setError("");
    try {
      await deleteTweet(tweetId);
      setTweets((current) => current.filter((tweet) => tweet._id !== tweetId));
      setMessage("Tweet deleted.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to delete tweet.");
    }
  };

  if (loading) return <Loading />;
  if (error && !tweets.length) return <Error error={error} />;

  return (
    <main
      className="mx-auto min-h-screen max-w-4xl px-4 py-8"
      style={{ color: PALETTE.ink, fontFamily: TYPOGRAPHY.font }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm"
        style={{ color: PALETTE.muted }}
      >
        <ArrowLeft size={16} /> Back to channel
      </button>

      <h1 className="text-3xl font-bold">Manage your tweets</h1>
      <p className="mt-2" style={{ color: PALETTE.muted }}>
        Share an update with your channel audience.
      </p>

      <form
        onSubmit={publish}
        className="mt-8 rounded-2xl border p-5"
        style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}
      >
        <h2 className="text-xl font-semibold">Post a tweet</h2>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What is happening on your channel?"
          rows="4"
          maxLength={280}
          className="mt-4 w-full rounded-xl border bg-transparent px-4 py-3 outline-none"
          style={{ borderColor: PALETTE.line }}
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-xs" style={{ color: PALETTE.subtle }}>
            {content.length}/280
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold disabled:opacity-50"
            style={{ backgroundColor: PALETTE.accent }}
          >
            <Plus size={18} /> {submitting ? "Posting..." : "Post tweet"}
          </button>
        </div>
      </form>

      {message && <p className="mt-4 text-sm" style={{ color: PALETTE.success }}>{message}</p>}
      {error && <p className="mt-4 text-sm" style={{ color: PALETTE.error }}>{error}</p>}

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold">Your tweets ({tweets.length})</h2>
        {tweets.length ? tweets.map((tweet) => (
          <article
            key={tweet._id}
            className="rounded-2xl border p-4"
            style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}
          >
            {editingId === tweet._id ? (
              <textarea
                value={editingContent}
                onChange={(event) => setEditingContent(event.target.value)}
                rows="3"
                maxLength={280}
                className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none"
                style={{ borderColor: PALETTE.line }}
              />
            ) : (
              <p className="leading-relaxed" style={{ color: PALETTE.ink }}>{tweet.content}</p>
            )}
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs" style={{ color: PALETTE.subtle }}>
                {new Date(tweet.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </span>
              <div className="flex gap-2">
                {editingId === tweet._id ? (
                  <>
                    <button type="button" title="Save tweet" onClick={() => save(tweet._id)} disabled={submitting} className="rounded-lg border p-2 disabled:opacity-50" style={{ borderColor: PALETTE.line, color: PALETTE.success }}><Save size={17} /></button>
                    <button type="button" title="Cancel editing" onClick={() => setEditingId(null)} className="rounded-lg border p-2" style={{ borderColor: PALETTE.line }}><X size={17} /></button>
                  </>
                ) : (
                  <button type="button" title="Edit tweet" onClick={() => { setEditingId(tweet._id); setEditingContent(tweet.content); }} className="rounded-lg border p-2" style={{ borderColor: PALETTE.line }}><Pencil size={17} /></button>
                )}
                <button type="button" title="Delete tweet" onClick={() => remove(tweet._id)} className="rounded-lg border p-2" style={{ borderColor: PALETTE.line, color: PALETTE.error }}><Trash2 size={17} /></button>
              </div>
            </div>
          </article>
        )) : (
          <p style={{ color: PALETTE.muted }}>No tweets posted yet.</p>
        )}
      </section>
    </main>
  );
};

export default UpdateTweets;