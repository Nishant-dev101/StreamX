import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecommendedVideos } from "../services/videos.service";
import Loading from "./loading";
import ErrorMessage from "./error";
import { PALETTE } from "../utils/styles";

const formatDuration = (duration = 0) => {
  const totalSeconds = Math.floor(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const UpnextVideos = ({ videoId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getRecommendedVideos(videoId);
        if (active) setVideos(response?.data?.data || []);
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message ||
              "Unable to load up next videos.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (videoId) loadRecommendations();
    return () => {
      active = false;
    };
  }, [videoId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-2">
      {videos.length ? (
        videos.map((video) => {
          const channel = Array.isArray(video.owner)
            ? video.owner[0]
            : video.owner;
          return (
            <button
              key={video._id}
              type="button"
              onClick={() => navigate(`/video/videoPlayerPage/${video._id}`)}
              className="flex w-full gap-3 overflow-hidden rounded-md border border-white/10 p-2 text-left transition hover:border-red-500/40"
              style={{ backgroundColor: PALETTE.surface }}
            >
              <div className="relative w-36 shrink-0 overflow-hidden rounded-md bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="aspect-video h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[0.68rem] text-white">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="min-w-0">
                <p
                  className="line-clamp-2 text-sm font-semibold leading-5"
                  style={{ color: PALETTE.ink }}
                >
                  {video.title}
                </p>
                <p
                  className="mt-1 truncate text-xs"
                  style={{ color: PALETTE.muted }}
                >
                  {channel?.userName || "Unknown creator"}
                </p>
                <p className="mt-1 text-xs" style={{ color: PALETTE.subtle }}>
                  {video.views ?? 0} views
                </p>
              </div>
            </button>
          );
        })
      ) : (
        <p className="text-sm" style={{ color: PALETTE.muted }}>
          No similar videos found.
        </p>
      )}
    </div>
  );
};

export default UpnextVideos;
