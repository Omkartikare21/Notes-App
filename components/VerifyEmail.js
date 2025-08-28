// VerifyEmail.js
'use client'
import React from 'react';
import styles from '@/styles/Home.module.css';

const VerifyEmail = ({ handleVerify }) => (
  <div className={styles.emailbg}>
    <table className={styles.emailfullwidth}>
      <tbody>
        <tr>
          <td align="center">
            <table className={styles.emailcard}>
              <tbody>
                <tr>
                  <td className={styles.emailcontent} align="center">
                    <h2 className={styles.emailtitle}>Verify Your Account</h2>
                    <p className={styles.emailtext}>
                      Thank you for signing up! Please click the button below to verify your email address.
                    </p>
                    <button
                      className={styles.emailbtn}
                      onClick={handleVerify}
                    >
                      Verify Account
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default VerifyEmail;
