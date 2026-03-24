import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config/urls.js";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!submit) return;
    setHasSubmitted(true);

    const { email, password } = formFields;
    if (!email || !password) {
      setFormError("Please fill all the required fields.");
      setSubmit(false);
      return;
    }

    (async () => {
      try {
        await axios.post(
          `${BACKEND_URL}/api/auth/login`,
          { ...formFields, role: "admin" },
          { withCredentials: true }
        );
        setFormError("");
        navigate("/admin");
      } catch (err) {
        const apiErrors = err?.response?.data?.errors;
        if (Array.isArray(apiErrors) && apiErrors.length) {
          setFormError(apiErrors[0].msg);
        } else {
          setFormError("Admin login failed.");
        }
      }

      setSubmit(false);
    })();
  }, [formFields, navigate, submit]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#171d24] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <section className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-white">Admin Login</h2>
          <p className="mt-2 text-sm text-[#95a5b4]">Sign in with an administrator account.</p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
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
            </div>

            {hasSubmitted && formError && <p className="text-sm text-rose-300">{formError}</p>}

            <button
              type="submit"
              onClick={() => setSubmit(true)}
              className="w-full rounded-2xl bg-[#d9e4ef] px-4 py-3 text-sm font-medium text-[#10212d] transition hover:bg-white"
            >
              Login as Admin
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link to="/admin/register" className="text-[#dce7f1] hover:text-white">
              Need an admin account?
            </Link>
            <Link to="/login" className="text-[#8ea1b3] hover:text-[#dce7f1]">
              Back to user login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
