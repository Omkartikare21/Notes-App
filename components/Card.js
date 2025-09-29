"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { EditorState } from "draft-js";
import dynamic from "next/dynamic";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "@/styles/Home.module.css";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const Card = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState({
    title: "",
    description: "",
  });
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  let editedNew
  let plainText

  const router = useRouter();
  if(!mounted) return null
  
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    editedNew = editorState.getCurrentContent();
    plainText = editedNew.getPlainText().trim();

    const html = draftToHtml(convertToRaw(editedNew));

    state.description = html;

    const form = { title: state.title, description: state.description };

    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrorMsg(errs);
      setIsSubmitting(false);
      return;
    }

    setErrorMsg({});

    try {
      const res = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create note");
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      setErrorMsg("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  }

  const validateForm = (form) => {
    const errors = {};
    if (!form.title || form.title.length < 3 || form.title.length > 42)
      errors.title = "Title needs 3 characters & 42 character max.";
      if(!editedNew || plainText.length < 10){
        errors.description = "Description should be atlease 10 characters."
      }
    return errors;
  };

  return (
    <section className={styles.noteCardNew} style={{ position: "relative" }}>
      <form onSubmit={onSubmit}>
        <input
          className={styles.inputField}
          type="text"
          name="title"
          placeholder="Title"
          value={state.title}
          onChange={handleChange}
        />
        {errorMsg.title && <p className={styles.errorText}>{errorMsg.title}</p>}
        {/* <textarea
          className={styles.textAreaField}
          name="description"
          placeholder="Description"
          value={description}
          onChange={handleChange}
        /> */}

        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName={styles.textAreaField}
          // wrapperClassName="wrapperClassName"
          // editorClassName="editorClassName"
          editorClassName="noteEditor"
          onEditorStateChange={setEditorState}
          placeholder="Description..."
        />

        {errorMsg.description && (
          <p className={styles.errorText}>{errorMsg.description}</p>
        )}
        <button type="submit"> {isSubmitting ? "Creating" : "Create"}</button>
      </form>
    </section>
  );
};

export default Card;