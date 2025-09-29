"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { EditorState, ContentState } from "draft-js";
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import htmlToDraft from "html-to-draftjs";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";

const Editcard = ({ note }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter();

  useEffect(() => {
    let cancelled = false
    // const html = editedNote?.description || "<p></p>";
    // const { contentBlocks, entityMap } = htmlToDraft(html);
    // const contentStatePrev = ContentState.createFromBlockArray(contentBlocks, entityMap);
    // setEditorState(EditorState.createWithContent(contentStatePrev));

    const run = async () => {
    const html = editedNote?.description || "";
    const { default: htmlToDraft } = await import("html-to-draftjs");
    const { contentBlocks, entityMap } = htmlToDraft(html);
    const contentStatePrev = ContentState.createFromBlockArray(contentBlocks, entityMap);
    if (!cancelled) {
      setEditorState(EditorState.createWithContent(contentStatePrev));
    }
  };

  run();
  return () => { cancelled = true; };

  }, [editedNote?.description]);

  const handleEdit = () => setIsEditing(true);

  const toHtml = convertToHTML({
    blockToHTML: (block) => {
      switch (block.type) {
        case "code-block":
        case "code":
          return { start: "<pre><code>", end: "</code></pre>" }; // proper code block wrapper, check docs.
        case "blockquote":
          return { start: "<blockquote>", end: "</blockquote>" };
        default:
          return null; // use default tags
      }
    },
    styleToHTML: (style) => {
      if (style === "CODE") return <code />; // inline code must be an element or string.
      return null;
    },
  });

  const handleSave = async (event) => {
    event.preventDefault();
    const html = toHtml(editorState.getCurrentContent()); // always a plain string.
    const payload = { ...editedNote, description: html };

    const res = await fetch(`http://localhost:3000/api/notes/${note._id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setEditedNote(result.data);
    setIsEditing(false);
  };

  const handleCancel = (e) =>{
    setIsEditing(false)
    setEditedNote({...editedNote, title: note?.title})
  }

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/api/notes/${note._id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${Cookies.get("token")}` },
    });
    const result = await res.json();
    if (result.success) router.push("/dashboard");
  };

  // sanitize the HTML string.
  const safeHtml = DOMPurify.sanitize(editedNote?.description || "", {
    ALLOWED_TAGS: [
      "pre","code","blockquote","p","br","em","strong","span",
      "ul","ol","li","h1","h2","h3","h4","h5","h6","a"
    ],
    ALLOWED_ATTR: ["href","target","rel","class","style"],
  });

  return (
    <section className={styles.noteSection1}>
      <article className={styles.card1}>
        <div className={styles.cardBtns}>
          {!isEditing && (
            <button onClick={handleEdit} className={styles.btnPrimary}>Edit Note</button>
          )}
          {!isEditing && (
            <button onClick={handleDelete} className={styles.btnDanger}>Delete Note</button>
          )}
        </div>

          <div className={styles.cardTitle}>
          {isEditing ? 
            <input
              type="text"
              className={styles.inputFieldEdit}
              value={editedNote?.title}
              onChange={(e) =>
                setEditedNote({ ...editedNote, title: e.target.value })
              }
            />
          : (
            <h3>
          {editedNote?.title}
            </h3>
          )}
          </div>

        {isEditing ? (
          <div className={styles.scrollArea} >
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName={styles.editorWrapper}
              editorClassName={styles.editor}
              toolbarClassName={styles.toolbar}
            />
            <div className={styles.editorActions}>
              <button onClick={handleSave} className={styles.btnPrimary}>Save</button>
              <button onClick={handleCancel} className={styles.btnGhost}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className={styles.scrollArea} >

          <div className={styles.noteBody} dangerouslySetInnerHTML={{ __html: safeHtml }} />
          </div>
        )}
      </article>
    </section>
  );
};

export default Editcard;