import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import "./admin.css";

const ADMIN_PASSWORD = "Q7mX2vLp9Rk4ZaT8";

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isAuthed = localStorage.getItem("adminToken");

  if (isAuthed) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const submit = (event) => {
    event.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect admin password.");
      return;
    }
    localStorage.setItem("adminToken", "medinnovate-cms");
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="admin-shell grid min-h-screen place-items-center p-5">
      <form onSubmit={submit} className="admin-card w-full max-w-md rounded-[34px] p-8">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-3xl bg-white p-2 text-white shadow-xl shadow-violet-200">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MedInnovate Logo" className="h-full w-full object-contain" />
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-violet-500">CMS Access</p>
        <h1 className="admin-heading mt-2 text-4xl font-black text-[#514aa3]">MedInnovate admin</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enter the admin password to open the conference CMS shell.
        </p>
        <label className="mt-7 grid gap-2 text-sm font-black text-slate-600">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="admin-field"
            autoFocus
          />
        </label>
        {error && <p className="mt-3 text-sm font-bold text-rose-600">{error}</p>}
        <button className="mt-6 w-full rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200">
          <Sparkles className="mr-2 inline" size={17} />
          Unlock CMS
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
