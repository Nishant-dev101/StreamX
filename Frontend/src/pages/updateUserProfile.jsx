import { useRef, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/loading";
import { updateUserAvatar, updateUserDetails } from "../services/auth.service";
import { PALETTE, TYPOGRAPHY } from "../utils/styles";

const UpdateUserProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [userName, setUserName] = useState(user?.userName || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!fullName.trim() || !userName.trim()) {
      setError("Full name and username are required.");
      return;
    }

    setLoading(true);
    try {
      const detailsResponse = await updateUserDetails({
        fullName: fullName.trim(),
        userName: userName.trim(),
      });
      let updatedUser = detailsResponse?.data?.data;
      if (avatar) {
        const avatarResponse = await updateUserAvatar(avatar);
        updatedUser = avatarResponse?.data?.data?.user || updatedUser;
      }
      if (updatedUser) setUser(updatedUser);
      setSuccess("Profile updated successfully.");
      setAvatar(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      URL.revokeObjectURL(preview);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to update your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loading />;

  return (
    <main
      className="min-h-screen px-4 py-8 sm:px-6"
      style={{
        color: PALETTE.ink,
        fontFamily: TYPOGRAPHY.font,
      }}
    >
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/user")}
          className="mb-6 flex items-center gap-2 text-sm"
          style={{ color: PALETTE.muted }}
        >
          <ArrowLeft size={16} />
          Back to profile
        </button>
        <form
          onSubmit={submit}
          className="overflow-hidden rounded-3xl border shadow-2xl"
          style={{ backgroundColor: PALETTE.card, borderColor: PALETTE.line }}
        >
          <div
            className="border-b px-5 py-6 sm:px-8"
            style={{ borderColor: PALETTE.line }}
          >
            <p
              className="mb-2 text-xs uppercase tracking-[0.3em]"
              style={{ color: PALETTE.accent }}
            >
              Account settings
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Update your profile
            </h1>
        
          </div>
          <div className="grid gap-8 px-5 py-7 sm:grid-cols-[auto_1fr] sm:px-8">
            <div className="flex flex-col items-center gap-3">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-white/10"
                />
              ) : (
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold"
                  style={{ backgroundColor: PALETTE.accent }}
                >
                  {userName[0]?.toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"
                style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
              >
                <ImagePlus size={16} />
                Change avatar
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="space-y-5">
              <label className="block">
                {" "}
                <span
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: PALETTE.muted }}
                >
                  Full name
                </span>
                <div
                  className="flex items-center gap-2 rounded-xl border px-3 py-3"
                  style={{
                    backgroundColor: PALETTE.surface,
                    borderColor: PALETTE.line,
                  }}
                >
                  <User size={16} color={PALETTE.muted} />
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent outline-none"
                    required
                  />
                </div>
              </label>
              <label className="block">
                <span
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: PALETTE.muted }}
                >
                  Username
                </span>
                <div
                  className="flex items-center gap-2 rounded-xl border px-3 py-3"
                  style={{
                    backgroundColor: PALETTE.surface,
                    borderColor: PALETTE.line,
                  }}
                >
                  <span style={{ color: PALETTE.muted }}>@</span>
                  <input
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent outline-none"
                    required
                  />
                </div>
              </label>
              {error && (
                <p className="text-sm" style={{ color: PALETTE.error }}>
                  {error}
                </p>
              )}
              {success && (
                <p
                  className="flex items-center gap-2 text-sm"
                  style={{ color: PALETTE.success }}
                >
                  <Check size={16} /> {success}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: PALETTE.accent, color: PALETTE.ink }}
              >
                <Save size={16} /> {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdateUserProfile;
