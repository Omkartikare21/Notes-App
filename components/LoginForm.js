"use client";
import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import CustomIcon from "./CustomIcon";
import GoogleButton from "@/utils/GoogleBtn";

const LoginForm = ({ handleLogin, handleForgotPassword, loading }) => {
  const [forgot, setForgot] = useState(false);

  const handleGoogleLogin = (e) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("justLoggedIn", "1");
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  return (
    <>
      {!forgot ? (
        <section className={styles.noteCard}>
          <form onSubmit={handleLogin}>
            <input
              className={styles.inputField}
              type="text"
              name="email"
              placeholder="Email"
              required
            />
            <input
              className={styles.inputField}
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
            <span style={{ marginLeft: "32%" }}></span>
          </form>
          <div className={styles.separator}>
            <span>OR</span>
          </div>

          {/* <button
            type="button"
            onClick={handleGoogleLogin}
            className={`${styles.googleSignInButton}`}
          >
            <div className={styles.googleDiv}>
              <CustomIcon  />
              Sign in with Google
            </div>
          </button> */}

          <GoogleButton onClickGoogle={handleGoogleLogin} />

          <p
            className={styles.description}
            style={{ color: "black", marginTop: "1rem" }}
          >
            {`Don't have an account?`}{" "}
            <Link
              href="/signup"
              style={{ color: "#e243ba", textDecoration: "underline" }}
            >
              Sign Up For Free
            </Link>{" "}
          </p>
          <button
            className={styles.forgotPassword}
            onClick={() => setForgot(true)}
          >
            Forgot Password?
          </button>
        </section>
      ) : (
        <section className={styles.noteCard}>
          <form onSubmit={handleForgotPassword}>
            <input
              className={styles.inputField}
              type="text"
              name="email"
              placeholder="Email"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <p className={styles.description} style={{ color: "black" }}>
              {`Don't have an account?`}{" "}
              <Link
                href="/signup"
                style={{ color: "#e243ba", textDecoration: "underline" }}
              >
                Sign Up For Free
              </Link>{" "}
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default LoginForm;
