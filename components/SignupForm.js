"use client";
import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const SignupForm = ({ handleSign }) => {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className={styles.noteCard}>
      <form onSubmit={handleSign}>
        <input
          className={styles.inputField}
          type="text"
          name="name"
          placeholder="Name"
          required
        />
        <input
          className={styles.inputField}
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <div style={{ position: "relative" }}>
          <input
            className={styles.inputField}
            type={show ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
          />

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "1.3em",
            }}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "🙈" : "👁️"}
          </button>
          </div>
          <div style={{ position: "relative" }}>
          <input
            className={styles.inputField}
            type={showConfirm ? "text" : "password"}
            name="confirm_password"
            placeholder="Confirm Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "1.3em",
            }}
            tabIndex={-1}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>
        <input
          className={styles.inputField}
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          required
        />
        <input
          className={styles.inputField}
          type="file"
          name="profilePic"
          placeholder="Profile Image"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className={styles.description} style={{ color: "black" }}>
        {`Don't have an account?`}{" "}
        <Link
          href="/login"
          style={{ color: "#e243ba", textDecoration: "underline" }}
        >
          Log in
        </Link>{" "}
      </p>
    </section>
  );
};

export default SignupForm;
