"use client";

import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [Image, setImage] = useState(null);

  const resetPassword = async () => {
    setError("");
    setSuccessMsg("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        "/api/auth/profile",
        {
          newPassword,
          currentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) {
        const data = await response.msg;
        setError(data || "Failed to reset password.");
      } else {
        toast.success("Password Updated Successfully!", { autoClose: 1500 });
        setSuccessMsg("Password successfully updated!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowModal(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const profileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("profilePic", Image);

    const res = await axios.post("/api/auth/profile", formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    await toast.success(res.data?.msg);
    setTimeout(() => (window.location.href = "/profile"), 2500);
  };

  const {data: session, status} = useSession()

  if (status === "loading") {
  return null
}

  const profileDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    let res

    if(session?.user !== undefined){
      res = await axios.delete("/api/auth/profile",{
        withCredentials: true
      })
    }else{ 
      res = await axios.delete("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    }
    await toast.success(res.data?.msg);
    setTimeout(() => (window.location.href = "/signup"), 2500);
  };

  // Eye SVG
  const Eye = (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      height="22"
      width="22"
    >
      <path d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
  // Eye-off SVG
  const EyeOff = (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      height="22"
      width="22"
    >
      <path d="M1 1l22 22M17.94 17.94C16.11 19.26 14.13 20 12 20c-7 0-11-8-11-8 1.36-2.54 3.35-4.96 6.06-6.94M9.53 9.53A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5a3.5 3.5 0 0 1-1.03 2.47" />
    </svg>
  );

  const closeModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowModal(false);
    setError("");
    setSuccessMsg("");
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Profile</h1>

    { session?.user !== undefined ? null : <>
        <button
          onClick={() => setShowModal(true)}
          className={styles.resetButton}
        >
          Reset Password
        </button>
        <button
          onClick={() => setShowImageModal(true)}
          className={styles.resetButton}
          style={{ marginTop: "20px" }}
        >
          Update ProfilePic
        </button>
          </> }
        <button
          onClick={() => setShowDeleteModal(true)}
          className={styles.resetButton}
          style={{ marginTop: "20px" }}
        >
          Delete Account
        </button>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Reset Password</h2>

              {successMsg && <p className={styles.success}>{successMsg}</p>}

              <label className={styles.label}>
                Current Password
                <div className={styles.inputWrapper}>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={styles.input}
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setShowCurrent((v) => !v)}
                    tabIndex={0}
                    role="button"
                    aria-label="Toggle password visibility"
                  >
                    {showCurrent ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </label>

              <label className={styles.label}>
                New Password
                <div className={styles.inputWrapper}>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setShowNew((v) => !v)}
                    tabIndex={0}
                    role="button"
                    aria-label="Toggle password visibility"
                  >
                    {showNew ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </label>

              <label className={styles.label}>
                Confirm New Password
                <div className={styles.inputWrapper}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={styles.input}
                  />

                  {/* This is hidden so that the user can enter the new password without seeing */}

                  {/* <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={0}
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  {showConfirm ? <EyeOff /> : <Eye />}
                </span> */}
                </div>
                {error && <p className={styles.error}>{error}</p>}
              </label>

              <div className={styles.buttons}>
                <button
                  className={styles.cancelButton}
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitButton}
                  onClick={resetPassword}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showImageModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Update Image</h2>

              <label className={styles.label}>
                Image
                <div className={styles.inputWrapper}>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    name="profilePic"
                    className={styles.input}
                  />
                </div>
              </label>

              <div className={styles.buttons}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowImageModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitButton}
                  onClick={profileUpdate}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Delete Account</h2>

              <label className={styles.label}>
                Are You Sure You Want To Delete Your Account?
              </label>

              <div className={styles.buttons}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitButton}
                  onClick={profileDelete}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
