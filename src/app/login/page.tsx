
"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "@/farebase/config";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useAuth } from "../components/Authcontent/authcontent";

interface LoginData {
  email: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firebase: "",
  });

  const validateInputs = () => {
    let emailError = "";
    let passwordError = "";

    if (!loginData.email.trim()) {
      emailError = "Email is required.";
    } else if (!validateEmail(loginData.email)) {
      emailError = "Invalid email address.";
    }

    if (!loginData.password.trim()) {
      passwordError = "Password is required.";
    } else if (!validatePassword(loginData.password)) {
      passwordError = "Password must be at least 6 characters long.";
    }

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError, firebase: "" });
      return false;
    }

    return true;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify(user));
      login();
      router.push("/");
      message.success("Welcome to the site!");
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = "Failed to sign in. Please check your credentials.";

      if (errorCode === "auth/user-not-found") {
        errorMessage = "User not found. Please check your email.";
      } else if (errorCode === "auth/wrong-password") {
        errorMessage = "Wrong password. Please try again.";
      }

      setErrors({ ...errors, firebase: errorMessage });
    }
  };

  return (
    <form
      className="max-w-md w-full mx-auto p-8 bg-white shadow-lg rounded-lg mt-52"
      onSubmit={handleSubmit}
    >
      <h1 className="text-4xl font-bold text-center mb-6">Login</h1>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
        />
        {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
        {errors.password && (
          <p className="text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      {errors.firebase && (
        <p className="text-red-500 mb-4">{errors.firebase}</p>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      >
        Login
      </button>

      <button
        onClick={() => router.push("/")}
        className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
      >
        Guest user
      </button>

      <p className="text-center">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default Login;
