import Head from "next/head";

// the below children is coming from _app.js
const Layout = ({ children }) => (
  <>
    <Head>
      <title>Notes App</title>
    </Head>
    {children}
  </>
);

export default Layout;
