"use client";
import React, { useEffect } from "react";
import { getNoteMetadata } from "@/utils/getNoteMetaData";
import { useRouter } from "next/navigation";
import Loading from "@/utils/Loading";

const Note = () => {
  getNoteMetadata("HOME");
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/login"), 1500);
  }, [router]);

  return (
    <>
      <Loading type="ROOT" />
    </>
  );
};

export default Note;
