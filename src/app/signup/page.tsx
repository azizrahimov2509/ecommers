"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/farebase/config";
import { message } from "antd";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/farebase/config"; // Импортируйте ваш Firestore конфиг

interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
}

const SignUp: React.FC = () => {
  const router = useRouter();
  const [signData, setSignData] = useState<SignUpData>({
    email: "",
    password: "",
    displayName: "",
    phoneNumber: "+998", // Предустановленный префикс номера телефона
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    firebase: "",
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const re = /^\+998\d{9}$/; // Проверка на формат +998 и 9 цифр
    return re.test(phoneNumber);
  };

  const validateInputs = () => {
    let emailError = "";
    let passwordError = "";
    let phoneNumberError = "";

    if (!validateEmail(signData.email)) {
      emailError = "Invalid email address.";
    }

    if (!validatePassword(signData.password)) {
      passwordError = "Password must be at least 6 characters long.";
    }

    if (!validatePhoneNumber(signData.phoneNumber)) {
      phoneNumberError =
        "Phone number must be in format +998XXXXXXXXX (9 digits after +998).";
    }

    if (emailError || passwordError || phoneNumberError) {
      setErrors({
        email: emailError,
        password: passwordError,
        phoneNumber: phoneNumberError,
        firebase: "",
      });
      return false;
    }

    setErrors({ email: "", password: "", phoneNumber: "", firebase: "" });
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

      if (user) {
        await updateProfile(user, {
          displayName: signData.displayName,
          // Убираем phoneNumber, так как он не поддерживается
        });

        // Сохраните информацию пользователя в Firestore
        await setDoc(doc(db, "users", user.uid), {
          displayName: signData.displayName,
          phoneNumber: signData.phoneNumber, // Сохраняем номер телефона
        });

        // Сохраните информацию о пользователе в localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: signData.displayName, // Сохраняем имя пользователя
            phoneNumber: signData.phoneNumber, // Сохраняем номер телефона
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

      <div className="mb-4">
        <label className="block text-gray-700">Phone Number</label>
        <input
          type="text"
          maxLength={13} // Ограничение на максимальную длину номера телефона (+998 + 9 цифр)
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Phone Number"
          value={signData.phoneNumber}
          onChange={(e) => {
            // Запрещаем пользователю удалять "+998"
            if (
              e.target.value.startsWith("+998") &&
              e.target.value.length <= 13
            ) {
              setSignData({ ...signData, phoneNumber: e.target.value });
            }
          }}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 mt-1">{errors.phoneNumber}</p>
        )}
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
