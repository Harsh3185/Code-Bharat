import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import mesh from "../assets/mesh.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({ firstName: "", lastName: "", email: "", password: "", role: "" });
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!submit) return;
    setHasSubmitted(true);
    const { firstName, lastName, email, password, role } = formFields;
    if (!firstName || !lastName || !email || !password || !role) {
      setFormError("Please fill all the required fields.");
      setSubmit(false);
      return;
    }
    (async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
          { ...formFields, role: formFields.role.toUpperCase() },
          { withCredentials: true }
        );
        setFormError("");
        navigate("/login");
      } catch (err) {
        console.error("Register error", err.response?.data || err.message);
        setFormError("Registration failed.");
      }
      setSubmit(false);
    })();
  }, [submit, formFields, navigate]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col overflow-hidden relative">

      <motion.img
        src={mesh}
        alt="mesh-bg"
        initial={{ opacity: 0.4, scale: 0.95, x: 0, y: 0 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: 1,
          x: [0, 30, 0, -30, 0],
          y: [0, -30, 0, 30, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-[-200px] top-[-150px] w-[1200px] pointer-events-none select-none z-0" />

      <main className="flex-grow grid md:grid-cols-2 place-items-center relative z-10 px-6 py-12">
        <div className="hidden md:block space-y-4 pr-8">
          <h1 className="text-5xl font-extrabold leading-tight">
            Create&nbsp;Account.
          </h1>
          <p className="text-lg text-gray-700 max-w-xs">
            Join Code Bharat and start solving problems today.
          </p>
        </div>

        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign up</h2>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-1 text-sm font-medium">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  onChange={(e) => setFormFields((p) => ({ ...p, firstName: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 text-sm font-medium">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  onChange={(e) => setFormFields((p) => ({ ...p, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                onChange={(e) => setFormFields((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                onChange={(e) => setFormFields((p) => ({ ...p, password: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="role" className="block mb-1 text-sm font-medium">Role</label>
              <select
                id="role"
                name="role"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                onChange={(e) =>
                  setFormFields((p) => ({ ...p, role: e.target.value.toUpperCase() }))
                }
              >
                <option value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {hasSubmitted && formError && <p className="text-red-600 text-sm">{formError}</p>}

            <button
              type="submit"
              onClick={() => setSubmit(true)}
              className="w-full mt-2 py-2 rounded-md bg-black text-white hover:bg-gray-900 transition-colors font-medium"
            >
              Submit
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?&nbsp;
            <Link to="/login" className="text-black underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}