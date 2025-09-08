"use client";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import { useUser } from "@/utils/UserContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const defaultImg =
    "https://res.cloudinary.com/mycloudupload/image/upload/v1757170353/profilepic/oqqga1etealzaal5ocxn.jpg";

  const userImg = user?.filePath;

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    Cookies.remove("token");
    toast.success("Logged out successfully", { autoClose: 1500 });
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link
          href={
            pathname === "/login" || pathname === "/signup"
              ? `/login`
              : `/dashboard`
          }
          className={styles.brand}
        >
          Notes App
        </Link>
      </div>
      <div className={styles.right}>
        {pathname !== "/login" && pathname !== "/signup" && pathname !== "/" && !pathname.startsWith("/forgotpassword") && !pathname.startsWith("/confirm") ? (
          <>
          <Link href="/profile">
          <Image
            src={`${userImg || defaultImg}`}
            alt="Profile"
            width={40}
            height={40}
            className={styles.profilePic}
            />
          </Link>
          </>
        ) : null}
        {pathname !== "/login" && pathname !== "/signup" && pathname !== "/" && !pathname.startsWith("/forgotpassword") && !pathname.startsWith("/confirm") ? (
          <Link href="/login" className={styles.create} onClick={handleLogout}>
            Logout
          </Link>
        ) : null}{" "}
        {pathname !== "/new" &&
        pathname !== "/login" &&
        pathname !== "/signup" &&
        pathname !== "/" && 
        !pathname.startsWith("/forgotpassword") 
        && !pathname.startsWith("/confirm")
        ? (
          <Link href="/new" className={styles.create}>
            Create new note
          </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
