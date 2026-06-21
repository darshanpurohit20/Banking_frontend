import React from "react";
import { Button } from "antd";
import { BankOutlined, LogoutOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.css";

/**
 * Navbar component for the Banking Management System.
 * Displays the application logo/title and user info with logout action if logged in.
 * 
 * @param {Object} props
 * @param {Object} props.currentUser - The logged-in user details ({ email })
 * @param {Function} props.onLogout - Callback to log out the user
 */
function Navbar({ currentUser, onLogout }) {
  console.log("Navbar: Rendered", { currentUser });

  return (
    <nav className={styles.navbar} id="appNavbar">
      <div className={styles.brand}>
        <BankOutlined className={styles.brandIcon} />
        <span>Banking Management System</span>
      </div>

      {currentUser && (
        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{currentUser.email}</span>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className={styles.logoutBtn}
            id="btnLogout"
          >
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
