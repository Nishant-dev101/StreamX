import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getVideoById, updateVideo } from "../services/videos.service";
import { PALETTE, TYPOGRAPHY } from "../utils/styles";
import Loading from "../components/loading";

const UpdateVideoDetails = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await getVideoById(videoId);
        const loadedVideo = response?.data?.data;
        setVideo(loadedVideo);
        setTitle(loadedVideo?.title || "");
        setDescription(loadedVideo?.description || "");
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message || "Unable to load this video.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [videoId]);

  const submit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateVideo(videoId, {
        title: title.trim(),
        description: description.trim(),
        thumbnail,
      });
      setMessage("Video updated successfully.");
      setVideo({
        ...video,
        title: title.trim(),
        description: description.trim(),
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Unable to update this video.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !video)
    return (
      <p className="p-8" style={{ color: PALETTE.error }}>
        {error}
      </p>
    );

  return (
    <main
      className="mx-auto min-h-screen max-w-3xl px-4 py-8"
      style={{ color: PALETTE.ink, fontFamily: TYPOGRAPHY.font }}
    >
      <button
        type="button"
        onClick={() => navigate("/update-videos")}
        className="mb-6 flex items-center gap-2 text-sm"
        style={{ color: PALETTE.muted }}
      >
        <ArrowLeft size={16} /> Back to videos
      </button>
      <form
        onSubmit={submit}
        className="rounded-2xl border p-5 sm:p-8"
        style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}
      >
        <h1 className="text-2xl font-bold">Update video details</h1>
        {video?.thumbnail && (
          <img
            src={video.thumbnail}
            alt="Current thumbnail"
            className="mt-6 aspect-video w-full rounded-xl object-cover"
          />
        )}
        <div className="mt-6 space-y-5">
          <label className="block text-sm font-semibold">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 font-normal outline-none"
              style={{ borderColor: PALETTE.line }}
            />
          </label>
          <label className="block text-sm font-semibold">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="6"
              className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 font-normal outline-none"
              style={{ borderColor: PALETTE.line }}
            />
          </label>
          <label
            className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm"
            style={{ borderColor: PALETTE.line, color: PALETTE.muted }}
          >
            <ImagePlus size={18} />{" "}
            {thumbnail?.name || "Replace thumbnail (optional)"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                setThumbnail(event.target.files?.[0] || null)
              }
            />
          </label>
          {error && (
            <p className="text-sm" style={{ color: PALETTE.error }}>
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm" style={{ color: PALETTE.success }}>
              {message}
            </p>
          )}
          <button
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold disabled:opacity-50"
            style={{ backgroundColor: PALETTE.accent }}
          >
            <Save size={17} /> {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateVideoDetails;
