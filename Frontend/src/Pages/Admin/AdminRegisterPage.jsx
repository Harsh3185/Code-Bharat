import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config/urls.js";

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    userName: "",
    email: "",
    password: "",
    adminSecret: "",
  });
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  const passwordRequirements =
    "Use 8-32 characters with at least one uppercase letter, one lowercase letter, one number, and one special character.";

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/.test(password);

  useEffect(() => {
    if (!submit) return;
    setHasSubmitted(true);

    const { userName, email, password, adminSecret } = formFields;
    if (!userName || !email || !password || !adminSecret) {
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
          { ...formFields, role: "admin" },
          { withCredentials: true }
        );
        setFormError("");
        navigate("/admin/login");
      } catch (err) {
        const apiErrors = err?.response?.data?.errors;
        if (Array.isArray(apiErrors) && apiErrors.length) {
          setFormError(apiErrors[0].msg);
        } else {
          setFormError(err?.response?.data?.message || "Admin registration failed.");
        }
      }

      setSubmit(false);
    })();
  }, [formFields, navigate, submit]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-[#11161c] shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-white/8 bg-[#0f1419] p-10 md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8ea1b3]">
            Admin Registration
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
            Create an administrator account in a separate flow.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#95a5b4]">
            Admin registration requires the administrator secret and should stay isolated from the public sign-up route.
          </p>
        </section>

        <section className="bg-[#171d24] p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-white">Admin Registration</h2>
          <p className="mt-2 text-sm text-[#95a5b4]">Create an administrator account.</p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="userName" className="mb-1 block text-sm text-[#cad5de]">User Name</label>
              <input
                id="userName"
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-[#0f1419] px-4 py-3 text-white outline-none placeholder:text-[#70808f]"
                onChange={(e) => setFormFields((p) => ({ ...p, userName: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-[#cad5de]">Email</label>
              <input
                id="email"
                type="email"
                className="w-full rounded-2xl border border-white/10 bg-[#0f1419] px-4 py-3 text-white outline-none placeholder:text-[#70808f]"
                onChange={(e) => setFormFields((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-[#cad5de]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f1419] px-4 py-3 pr-16 text-white outline-none placeholder:text-[#70808f]"
                  onChange={(e) => setFormFields((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#9fb0bf] transition hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1 text-xs text-[#7d8f9f]">{passwordRequirements}</p>
            </div>

            <div>
              <label htmlFor="adminSecret" className="mb-1 block text-sm text-[#cad5de]">Admin Secret</label>
              <div className="relative">
                <input
                  id="adminSecret"
                  type={showAdminSecret ? "text" : "password"}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f1419] px-4 py-3 pr-16 text-white outline-none placeholder:text-[#70808f]"
                  onChange={(e) => setFormFields((p) => ({ ...p, adminSecret: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowAdminSecret((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#9fb0bf] transition hover:text-white"
                >
                  {showAdminSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {hasSubmitted && formError && <p className="text-sm text-rose-300">{formError}</p>}

            <button
              type="submit"
              onClick={() => setSubmit(true)}
              className="w-full rounded-2xl bg-[#d9e4ef] px-4 py-3 text-sm font-medium text-[#10212d] transition hover:bg-white"
            >
              Create Admin Account
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link to="/admin/login" className="text-[#dce7f1] hover:text-white">
              Already have an admin account?
            </Link>
            <Link to="/register" className="text-[#8ea1b3] hover:text-[#dce7f1]">
              Back to user registration
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
