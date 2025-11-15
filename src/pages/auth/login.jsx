import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(form));
  }

  // 🔥 redirect after login success
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/betting");  // <--- FIXED
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      <p className="text-center mt-3 text-sm">
        Don't have an account?{" "}
        <Link className="text-blue-600 underline" to="/auth/register">
          Register
        </Link>
      </p>
    </div>
  );
}
