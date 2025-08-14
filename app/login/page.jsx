"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Read from .env with fallback values
  const validLoginId = process.env.NEXT_PUBLIC_LOGIN_ID || "admin";
  const validPassword = process.env.NEXT_PUBLIC_LOGIN_PASSWORD || "12345";

  // Debug: Log once on mount
  useEffect(() => {
    console.log("✅ Loaded Login ID:", validLoginId);
    console.log("✅ Loaded Password:", validPassword);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginId === validLoginId && password === validPassword) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/learn");
    } else {
      setError("Invalid Login ID or Password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Login ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
