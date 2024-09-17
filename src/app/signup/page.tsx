"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/farebase/config";
import { message } from "antd";

interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

const SignUp: React.FC = () => {
  const router = useRouter();
  const [signData, setSignData] = useState<SignUpData>({
    email: "",
    password: "",
    displayName: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firebase: "",
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateInputs = () => {
    let emailError = "";
    let passwordError = "";

    if (!validateEmail(signData.email)) {
      emailError = "Invalid email address.";
    }

    if (!validatePassword(signData.password)) {
      passwordError = "Password must be at least 6 characters long.";
    }

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError, firebase: "" });
      return false;
    }

    setErrors({ email: "", password: "", firebase: "" });
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signData.email,
        signData.password
      );

      const user = userCredential.user;

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: signData.displayName,
        });

        // Save the user's profile info to localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            photoURL: auth.currentUser.photoURL || "", // Save the photo URL if available
          })
        );
      }

      message.success("Sign up successful!");
      router.push("/");
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = "Failed to sign up. Please check your credentials.";

      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "Email already in use. Please use another email.";
      }

      setErrors({ ...errors, firebase: errorMessage });
    }
  };

  return (
    <form
      className="max-w-md w-full mx-auto p-8 bg-white shadow-md rounded-lg mt-44"
      onSubmit={handleSubmit}
    >
      <h1 className="text-4xl font-bold text-center mb-6">Sign Up</h1>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={signData.email}
          onChange={(e) => setSignData({ ...signData, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={signData.password}
          onChange={(e) =>
            setSignData({ ...signData, password: e.target.value })
          }
        />
        {errors.password && (
          <p className="text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          value={signData.displayName}
          onChange={(e) =>
            setSignData({ ...signData, displayName: e.target.value })
          }
        />
      </div>

      {errors.firebase && (
        <p className="text-red-500 mb-4">{errors.firebase}</p>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Sign Up
      </button>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default SignUp;
