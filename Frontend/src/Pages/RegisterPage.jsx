import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import mesh from "../assets/mesh.png";
import { BACKEND_URL } from "../config/urls.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({ userName: "", email: "", password: "" });
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRequirements =
    "Use 8-32 characters with uppercase, lowercase, number, and special character.";

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/.test(password);

  useEffect(() => {
    if (!submit) return;
    setHasSubmitted(true);
    const { userName, email, password } = formFields;
    if (!userName || !email || !password) {
      setFormError("Please fill all the required fields.");
      setSubmit(false);
      return;
    }
    if (!isStrongPassword(password)) {
      setFormError(passwordRequirements);
      setSubmit(false);
      return;
    }
    (async () => {
      try {
        await axios.post(
          `${BACKEND_URL}/api/auth/register`,
          { ...formFields, role: "user" },
          { withCredentials: true }
        );
        setFormError("");
        navigate("/login");
      } catch (err) {
        console.error("Register error", err.response?.data || err.message);
        const apiErrors = err?.response?.data?.errors;
        if (Array.isArray(apiErrors) && apiErrors.length) {
          setFormError(apiErrors[0].msg);
        } else {
          setFormError(err?.response?.data?.message || "Registration failed.");
        }
      }
      setSubmit(false);
    })();
  }, [submit, formFields, navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0f14] text-white">
      <img
        src={mesh}
        alt="Code Bharat background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,14,0.72)_0%,rgba(6,10,14,0.46)_45%,rgba(6,10,14,0.38)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-end px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-[30px] border border-white/15 bg-black/25 p-7 backdrop-blur-md sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
            Register
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Create account</h1>
          <p className="mt-2 text-sm text-white/75">Start solving.</p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="userName" className="mb-2 block text-sm font-medium text-white/85">
                User Name
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
                onChange={(e) => setFormFields((p) => ({ ...p, userName: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/85">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
                onChange={(e) => setFormFields((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/85">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 pr-16 text-white outline-none placeholder:text-white/35"
                  onChange={(e) => setFormFields((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/70 transition hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-2 text-xs text-white/65">{passwordRequirements}</p>
            </div>

            {hasSubmitted && formError && <p className="text-sm text-rose-200">{formError}</p>}

            <button
              type="submit"
              onClick={() => setSubmit(true)}
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-[#10212d] transition hover:bg-[#e7eef5]"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-sm text-white/72">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-white">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
