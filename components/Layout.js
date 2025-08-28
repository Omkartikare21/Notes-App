import Head from "next/head";
import Navbar from "@/components/NavBar";

// the below children is coming from _app.js
const Layout = ({ children }) => (
  <>
    <Head>
      <title>Notes App</title>
    </Head>
    <Navbar />
    {children}
  </>
);

export default Layout;
