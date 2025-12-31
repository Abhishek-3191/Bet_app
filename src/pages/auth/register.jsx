import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Trigger Redux register
      await dispatch(registerUser(form)).unwrap();

      // Redirect after success
      navigate("/auth/login");
    } catch (err) {
      console.log("Registration failed:", err);
      alert("Registration failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Username"
          name="userName"
          value={form.userName}
          onChange={handleChange}
        />

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
          Register
        </Button>
      </form>

      <p className="text-center mt-3 text-sm">
        Already have an account?{" "}
        <Link className="text-blue-600 underline" to="/auth/login">
          Login
        </Link>
      </p>
    </div>
  );
}
