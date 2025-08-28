'use client'
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    toast.success("Logged out successfully", { autoClose: 1500 });
    setTimeout(() => router.push('/login'), 1500);
  };

  return (
  <nav className={styles.navbar}>
    <div className={styles.left}>
      <Link href={ pathname === "/login" || pathname === "/signup" ? `/login` : `/dashboard`} className={styles.brand}>
        Notes App
      </Link>
    </div>
      <div className={styles.right}>
        {pathname !== "/login" && pathname !== "/signup" ? 
        <Link href="/login" className={styles.create} onClick={handleLogout} >
          Logout
        </Link>
        : null}
        {' '}
        {pathname !== "/new" && pathname !== '/login' && pathname !== '/signup' ?
        <Link href="/new" className={styles.create}>
          Create new note
        </Link>
        : null }
      </div>
  </nav>
)};

export default Navbar;
