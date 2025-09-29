"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import styles from "@/styles/landing.module.css";

import animationData from "../public/images/home.json";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEmailLogin = () => {
    // router.push("/login");
  };

  const handleGoogleLogin = () => {
    // router.push("/signup")
  };

  return (
    <div className={styles.page}>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={styles.title}
            >
              Save notes anywhere, find them instantly
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
              className={styles.subtitle}
            >
              Capture ideas in the cloud, organize and access across devices—fast, private, and delightful.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className={styles.ctaRow}
            >
              <Link href="/signup" className={styles.ctaPrimary}>
                Get started free
              </Link>
              <button onClick={handleEmailLogin} className={styles.ctaSecondary}>
                Continue with Email
              </button>
              <button onClick={handleGoogleLogin} className={styles.googleBtn}>
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  className={styles.googleIcon}
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.23 9.21 3.64l6.9-6.9C35.9 2.4 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.05 6.25C12.36 13.2 17.67 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.66-.15-3.26-.44-4.79H24v9.08h12.7c-.55 2.97-2.2 5.49-4.7 7.18l7.16 5.56C43.73 37.5 46.5 31.49 46.5 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.61 19.47l-8.05-6.25C.92 16.22 0 20.01 0 24c0 3.92.9 7.64 2.5 10.92l8.11-6.34C9.85 26.47 9.5 25.27 9.5 24c0-1.8.4-3.5 1.11-5z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.14 15.9-5.84l-7.16-5.56c-2 1.35-4.56 2.15-8.74 2.15-6.33 0-11.64-3.7-13.29-8.63l-8.11 6.34C6.5 42.62 14.61 48 24 48z"
                  />
                </svg>
                Continue with Google
              </button>
            </motion.div>

            <div className={styles.heroStats}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={styles.statCard}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <span className={styles.statNumber}>10k+</span>
                <span className={styles.statLabel}>Active users</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={styles.statCard}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <span className={styles.statNumber}>99.99%</span>
                <span className={styles.statLabel}>Sync uptime</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={styles.statCard}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <span className={styles.statNumber}>1M+</span>
                <span className={styles.statLabel}>Notes saved</span>
              </motion.div>
            </div>
          </div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className={styles.lottieWrap} aria-hidden="true">
              <Lottie
                animationData={animationData}
                loop={true}
                className={styles.lottie}
              />
            </div>
            <div className={styles.cardShadow} />
          </motion.div>
        </section>

        <section id="features" className={styles.features}>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={styles.sectionTitle}
          >
            Everything needed to think clearly
          </motion.h2>

          <div className={styles.featureGrid}>
            {[
              { title: "Cloud sync", desc: "Real-time sync across devices with conflict-free editing." },
              { title: "Smart tags", desc: "Tag notes, filter instantly, and create saved views." },
              { title: "Offline first", desc: "Write without internet; sync resumes automatically." },
              { title: "Fast search", desc: "Blazing full-text search with typos tolerated." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className={styles.pricing}>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={styles.sectionTitle}
          >
            Simple pricing
          </motion.h2>

          <div className={styles.pricingGrid}>
            <motion.div
              className={styles.priceCard}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
            >
              <div className={styles.priceHeader}>Free</div>
              <div className={styles.priceTag}>₹0</div>
              <ul className={styles.priceList}>
                <li>Unlimited notes</li>
                <li>Cloud sync</li>
                <li>Basic search</li>
              </ul>
              <Link href="/signup" className={styles.priceCta}>
                Start free
              </Link>
            </motion.div>

            <motion.div
              className={`${styles.priceCard} ${styles.highlight}`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
            >
              <div className={styles.priceHeader}>Pro</div>
              <div className={styles.priceTag}>₹299/mo</div>
              <ul className={styles.priceList}>
                <li>Priority sync</li>
                <li>Advanced search</li>
                <li>Smart exports</li>
              </ul>
              <Link href="/signup" className={styles.priceCta}>
                Upgrade
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="faq" className={styles.faq}>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={styles.sectionTitle}
          >
            Frequently asked questions
          </motion.h2>

          <div className={styles.faqList}>
            {[
              {
                q: "Is there a free plan?",
                a: "Yes, the Free plan includes unlimited notes and sync."
              },
              {
                q: "Can notes be accessed offline?",
                a: "Yes, notes work offline and sync when back online."
              },
              {
                q: "Do third-party logins work?",
                a: "Yes, Google login is supported alongside email."
              },
            ].map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{item.q}</summary>
                <p className={styles.faqA}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()}Notes App</span>
        <div className={styles.footerLinks}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
