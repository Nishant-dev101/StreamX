import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  deleteVideo,
  getUserVideos,
  togglePublishedStatus,
  uploadVideo,
} from "../services/videos.service";
import { PALETTE, TYPOGRAPHY } from "../utils/styles";
import Loading from "../components/loading";
import Error from "../components/error";

const UpdateVideos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: null,
    videoFile: null,
  });

  const thumbnailRef = useRef(null);
  const videoRef = useRef(null);

  const loadVideos = async () => {
    if (!user?._id) return;
    try {
      const response = await getUserVideos(user._id);
      setVideos(response?.data?.data || []);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Unable to load your videos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [user?._id]);

  const upload = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.thumbnail ||
      !form.videoFile
    ) {
      setError("Title, description, thumbnail, and video file are required.");
      return;
    }
    setSubmitting(true);
    try {
      await uploadVideo({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setForm({ title: "", description: "", thumbnail: null, videoFile: null });
      if (thumbnailRef.current) thumbnailRef.current.value = "";
      if (videoRef.current) videoRef.current.value = "";
      setMessage("Video uploaded successfully.");
      await loadVideos();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Unable to upload video.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (video) => {
    if (!window.confirm(`Delete "${video.title}"?`)) return;
    try {
      await deleteVideo(video._id);
      setVideos((current) => current.filter((item) => item._id !== video._id));
      setMessage("Video deleted.");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Unable to delete video.",
      );
    }
  };

  const toggleVisibility = async (video) => {
    try {
      const response = await togglePublishedStatus(video._id);
      const published = response?.data?.data?.ispublised ?? !video.ispublised;
      setVideos((current) =>
        current.map((item) =>
          item._id === video._id ? { ...item, ispublised: published } : item,
        ),
      );
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Unable to change visibility.",
      );
    }
  };

  if (loading) return <Loading />;
  if (error && !videos.length) return <Error error={error} />;
  return (
    <main
      className="mx-auto min-h-screen max-w-6xl px-4 py-8"
      style={{ color: PALETTE.ink, fontFamily: TYPOGRAPHY.font }}
    >
      <button
        type="button"
        onClick={() => navigate("/user")}
        className="mb-6 flex items-center gap-2 text-sm"
        style={{ color: PALETTE.muted }}
      >
        <ArrowLeft size={16} /> Back to profile
      </button>
      <h1 className="text-3xl font-bold">Manage your videos</h1>
      <p className="mt-2" style={{ color: PALETTE.muted }}>
        Upload new videos or manage the ones already on your channel.
      </p>
      <form
        onSubmit={upload}
        className="mt-8 grid gap-4 rounded-2xl border p-5 md:grid-cols-2"
        style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}
      >
        <h2 className="text-xl font-semibold md:col-span-2">Upload a video</h2>
        <input
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          placeholder="Video title"
          className="rounded-xl border bg-transparent px-4 py-3 outline-none"
          style={{ borderColor: PALETTE.line }}
        />
        <textarea
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          placeholder="Description"
          rows="3"
          className="rounded-xl border bg-transparent px-4 py-3 outline-none md:row-span-2"
          style={{ borderColor: PALETTE.line }}
        />
        <label
          className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: PALETTE.line, color: PALETTE.muted }}
        >
          <ImagePlus size={18} /> {form.thumbnail?.name || "Choose thumbnail"}
          <input
            ref={thumbnailRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) =>
              setForm({ ...form, thumbnail: event.target.files?.[0] || null })
            }
          />
        </label>
        <label
          className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: PALETTE.line, color: PALETTE.muted }}
        >
          <Upload size={18} /> {form.videoFile?.name || "Choose video"}
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(event) =>
              setForm({ ...form, videoFile: event.target.files?.[0] || null })
            }
          />
        </label>
        <button
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold disabled:opacity-50"
          style={{ backgroundColor: PALETTE.accent }}
        >
          <Plus size={18} /> {submitting ? "Uploading..." : "Upload video"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm" style={{ color: PALETTE.success }}>
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm" style={{ color: PALETTE.error }}>
          {error}
        </p>
      )}
      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold">Your videos ({videos.length})</h2>
        {videos.map((video) => (
          <article
            key={video._id}
            className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center"
            style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}
          >
            <img
              src={video.thumbnail}
              alt=""
              className="aspect-video w-full rounded-lg object-cover sm:w-40"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{video.title}</h3>
              <p
                className="mt-1 line-clamp-2 text-sm"
                style={{ color: PALETTE.muted }}
              >
                {video.description}
              </p>
              <span
                className="mt-2 inline-block text-xs"
                style={{
                  color: video.ispublised ? PALETTE.success : PALETTE.warning,
                }}
              >
                {video.ispublised ? "Published" : "Hidden"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                title="Edit video"
                onClick={() => navigate(`/update-details/${video._id}`)}
                className="rounded-lg border p-2"
                style={{ borderColor: PALETTE.line }}
              >
                <Pencil size={17} />
              </button>
              <button
                type="button"
                title="Toggle visibility"
                onClick={() => toggleVisibility(video)}
                className="rounded-lg border p-2"
                style={{ borderColor: PALETTE.line }}
              >
                {video.ispublised ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
              <button
                type="button"
                title="Delete video"
                onClick={() => remove(video)}
                className="rounded-lg border p-2"
                style={{ borderColor: PALETTE.line, color: PALETTE.error }}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default UpdateVideos;
