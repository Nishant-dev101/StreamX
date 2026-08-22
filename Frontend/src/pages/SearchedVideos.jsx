import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoTray from "../components/videoTray";
import Loading from "../components/loading";
import Error from "../components/error";
import { searchVideos } from "../services/videos.service";
import { PALETTE } from "../utils/styles";

const SearchedVideos = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setVideos([]);
      setLoading(false);
      return;
    }
    const loadResults = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await searchVideos(query);
        setVideos(response?.data?.data || []);
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message || "Unable to search videos.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [query]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  return (
    <main className="mt-8" style={{ color: PALETTE.ink }}>
      <h1 className="mb-6 text-2xl font-bold">Search results for “{query}”</h1>
      {videos.length ? (
        <VideoTray videos={videos} />
      ) : (
        <p style={{ color: PALETTE.muted }}>No videos matched your search.</p>
      )}
    </main>
  );
};

export default SearchedVideos;
