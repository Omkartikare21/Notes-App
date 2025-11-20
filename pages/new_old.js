import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import { useState, useEffect, useCallback } from "react";
import Card from "@/components/Card";

const NewNote = () => {
  const [form, setForm] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const createNote = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_FE_API_URL}/api/notes`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }, [form, router]);

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        // this object.keys is used to check for errors and see if its equal to 0
        // otherwise it will set IsSubmitting to false if condition fails.

        createNote();
        // alert("this works");
      } else {
        setIsSubmitting(false); // we set this false coz if ntg is there it will display the form
      }
    }
  }, [errors, createNote, isSubmitting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    setIsSubmitting(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // here we fetch previous state for "form", and we target the
    // "name" and assign its value.
  };

  const validate = () => {
    let err = {};

    if (form.title.length < 3) {
      err.title = "Title must be at least 3 characters long";
    }
    if (form.description.length < 15) {
      err.description = "Description must be at least 15 characters long";
    }

    return err;
  };

  return (
    <div className="form-container">
      <h1>create a new Note</h1>
      <div>
        {isSubmitting ? (
        //   <Loader active inline="centered" />
        <p>Submitting...</p>
        ) : (

    <Card title={form.title} description={form.description} handleChange={handleChange} onSubmit={handleSubmit} errs={errors} />
)}
      </div>
    </div>
  );
};

export default NewNote;
