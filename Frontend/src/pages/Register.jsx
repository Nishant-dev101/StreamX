import { useRef, useState } from "react";
import { User, Mail, Lock, Upload, AlertCircle, ArrowRight, Check, X } from "lucide-react";
import { register } from "../services/auth.service";
import { LoadingBanner } from "../components/loading";

const PALETTE = {
    page: "#0F0F0F",
    navbar: "#181818",
    card: "#1A1A1A",
    surface: "#212121",
    ink: "#FFFFFF",
    muted: "#A8A8A8",
    subtle: "#717171",
    line: "#303030",
    accent: "#FF3B30",
    accentDark: "#D92C21",
    accentLight: "#FF5C54",
    blue: "#3EA6FF",
    success: "#22C55E",
    warning: "#FACC15",
    error: "#EF4444",
    hover: "#2A2A2A",
    active: "#343434",
    rail: "#151515",
    railText: "#F7F7F7",
};

const TYPOGRAPHY = {
    font: "'Inter', sans-serif",
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    h1: "2.5rem",
    h2: "2rem",
    h3: "1.5rem",
    h4: "1.25rem",
    title: "1rem",
    body: "0.95rem",
    description: "0.9rem",
    caption: "0.8rem",
    small: "0.75rem",
    button: "0.9rem",
    input: "0.95rem",
    lineTitle: 1.3,
    lineBody: 1.6,
    lineDescription: 1.7,
};

export const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");
    const fileInputRef = useRef(null);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !email || !password) {
            setError("All fields are required to register.");
            return;
        }

        setLoading(true);

        try {
            const res = await register({ username, email, password, avatar });
            console.log(res);
            setSubmitted(true);
        } catch (err) {
            setError(err?.message || "Unable to create your account right now.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeAvatar = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setAvatar(null);
        setPreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center px-4 py-2 sm:px-6"
        style={{
            background: `radial-gradient(circle at top left, ${PALETTE.accent}22 0%, transparent 35%), linear-gradient(135deg, ${PALETTE.page} 0%, #111111 100%)`,
            fontFamily: TYPOGRAPHY.font,
        }}>

         <div class="flex-col gap-4 w-full flex items-center justify-center">
            <div
                class="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
            >
                <div
                    class="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                ></div>
            </div>
        </div>


    </div>

    return (
        <div
            className="h-screen overflow-hidden flex items-center justify-center px-4 py-2 sm:px-6"
            style={{
                background: `radial-gradient(circle at top left, ${PALETTE.accent}22 0%, transparent 35%), linear-gradient(135deg, ${PALETTE.page} 0%, #111111 100%)`,
                fontFamily: TYPOGRAPHY.font,
            }}
        >
            {submitted ? (
                <div
                    className="w-full max-w-md rounded-2xl p-8 text-center shadow-2xl"
                    style={{
                        backgroundColor: PALETTE.card,
                        border: `1px solid ${PALETTE.line}`,
                        boxShadow: `0 24px 70px rgba(0, 0, 0, 0.45)`,
                    }}
                >
                    <div
                        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ backgroundColor: PALETTE.accent }}
                    >
                        <Check size={24} color={PALETTE.railText} />
                    </div>
                    <p className="mb-2 text-xs uppercase tracking-[0.35em]" style={{ color: PALETTE.muted, fontSize: TYPOGRAPHY.small, fontWeight: TYPOGRAPHY.medium }}>
                        Registration complete
                    </p>
                    <h2 className="mb-3" style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.h3, fontWeight: TYPOGRAPHY.bold, lineHeight: TYPOGRAPHY.lineTitle }}>
                        Welcome, {username}
                    </h2>
                    <p className="text-sm" style={{ color: PALETTE.success, fontSize: TYPOGRAPHY.body, fontWeight: TYPOGRAPHY.medium }}>
                        Your account is ready. You can sign in anytime.
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={submit}
                    className="w-full max-w-4xl max-h-[calc(100vh-1rem)] overflow-hidden rounded-3xl shadow-2xl sm:flex m-2"
                    style={{
                        backgroundColor: PALETTE.card,
                        border: `1px solid ${PALETTE.line}`,
                        boxShadow: `0 24px 70px rgba(0, 0, 0, 0.45)`,
                    }}
                >
                    <div
                        className="hidden sm:flex sm:w-36 sm:flex-col sm:items-center sm:justify-between sm:py-10 sm:relative"
                        style={{ backgroundColor: PALETTE.rail, color: PALETTE.railText }}
                    >
                        <div className="absolute right-[-7px] top-[-7px] h-4 w-4 rounded-full" style={{ backgroundColor: PALETTE.page }} />
                        <span className="rotate-180 text-[0.65rem] uppercase tracking-[0.35em]" style={{ writingMode: "vertical-rl", fontWeight: TYPOGRAPHY.semibold }}>
                            User registration
                        </span>
                        <span className="m-2 text-[0.7rem] opacity-60" style={{ fontWeight: TYPOGRAPHY.light }}>
                            We respect your privacy
                        </span>
                        <div className="absolute bottom-[-7px] right-[-7px] h-4 w-4 rounded-full" style={{ backgroundColor: PALETTE.page }} />
                    </div>

                    <div className="flex-1 p-5 sm:p-7 overflow-hidden">
                        <p className="mb-2 text-xs uppercase tracking-[0.35em]" style={{ color: PALETTE.muted, fontSize: TYPOGRAPHY.small, fontWeight: TYPOGRAPHY.medium }}>
                            Account registration
                        </p>
                        <h2 className="mb-2" style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.h2, fontWeight: TYPOGRAPHY.bold, lineHeight: TYPOGRAPHY.lineTitle }}>
                            Create account
                        </h2>
                        <p className="mb-4 text-sm" style={{ color: PALETTE.muted, fontSize: TYPOGRAPHY.body, lineHeight: TYPOGRAPHY.lineBody }}>
                            Join the community with a few details and start exploring.
                        </p>

                        {error && (
                            <div
                                className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/20 p-3"
                                style={{ backgroundColor: "#2a1414", borderLeft: `4px solid ${PALETTE.error}` }}
                            >
                                <AlertCircle size={16} color={PALETTE.error} className="mt-0.5 flex-shrink-0" />
                                <span className="text-sm" style={{ color: PALETTE.error, fontSize: TYPOGRAPHY.body, fontWeight: TYPOGRAPHY.medium }}>
                                    {error}
                                </span>
                            </div>
                        )}

                        <label className="mb-3 block">
                            <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.3em]" style={{ color: PALETTE.muted, fontWeight: TYPOGRAPHY.medium }}>
                                Username
                            </span>
                            <div className="flex items-center gap-2 rounded-2xl border border-transparent px-3 py-3 transition-all" style={{ backgroundColor: PALETTE.surface, borderColor: PALETTE.line }}>
                                <User size={16} color={PALETTE.muted} />
                                <input
                                    className="flex-1 bg-transparent outline-none"
                                    style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.input, fontWeight: TYPOGRAPHY.regular }}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </label>

                        <label className="mb-3 block">
                            <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.3em]" style={{ color: PALETTE.muted, fontWeight: TYPOGRAPHY.medium }}>
                                Email
                            </span>
                            <div className="flex items-center gap-2 rounded-2xl border border-transparent px-3 py-3 transition-all" style={{ backgroundColor: PALETTE.surface, borderColor: PALETTE.line }}>
                                <Mail size={16} color={PALETTE.muted} />
                                <input
                                    type="email"
                                    className="flex-1 bg-transparent outline-none"
                                    style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.input, fontWeight: TYPOGRAPHY.regular }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </label>

                        <label className="mb-4 block">
                            <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.3em]" style={{ color: PALETTE.muted, fontWeight: TYPOGRAPHY.medium }}>
                                Password
                            </span>
                            <div className="flex items-center gap-2 rounded-2xl border border-transparent px-3 py-3 transition-all" style={{ backgroundColor: PALETTE.surface, borderColor: PALETTE.line }}>
                                <Lock size={16} color={PALETTE.muted} />
                                <input
                                    type="password"
                                    className="flex-1 bg-transparent outline-none"
                                    style={{ color: PALETTE.ink, fontSize: TYPOGRAPHY.input, fontWeight: TYPOGRAPHY.regular }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                        </label>

                        <label className="mb-4 block cursor-pointer">
                            <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.3em]" style={{ color: PALETTE.muted, fontWeight: TYPOGRAPHY.medium }}>
                                Avatar (optional)
                            </span>
                            <div
                                className="flex items-center gap-3 rounded-2xl border border-dashed p-3"
                                style={{ borderColor: PALETTE.muted, backgroundColor: PALETTE.surface }}
                            >
                                {preview ? (
                                    <img src={preview} alt="avatar preview" className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <Upload size={16} color={PALETTE.muted} />
                                )}
                                <span className="flex-1 truncate text-sm" style={{ color: avatar ? PALETTE.ink : PALETTE.muted, fontSize: TYPOGRAPHY.body }}>
                                    {avatar ? avatar.name : "Add a profile photo"}
                                </span>
                                {preview && (
                                    <button
                                        type="button"
                                        className="rounded-full p-1"
                                        style={{ backgroundColor: "#2a2a2a", color: PALETTE.ink }}
                                    >
                                        <X size={14} onClick={removeAvatar} />
                                    </button>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>
                        </label>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs uppercase tracking-[0.3em] transition-all"
                            style={{ backgroundColor: PALETTE.accent, color: PALETTE.railText, fontWeight: TYPOGRAPHY.semibold }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PALETTE.accentDark)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PALETTE.accent)}

                        >
                            Create account
                            <ArrowRight size={14} />
                        </button>

                        <div className='flex justify-center flex-col items-center pt-4'>
                            <p
                                style={{ color: PALETTE.muted }}
                            >
                                Already Have an Account?
                            </p>
                            <p
                                className='cursor-pointer'
                                style={{ color: PALETTE.blue }}>Back to Login</p>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};
