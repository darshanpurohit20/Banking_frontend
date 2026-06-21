import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, BankOutlined } from "@ant-design/icons";
import styles from "./Login.module.css";

/**
 * Login component for authentication.
 * Performs client-side mock authentication.
 * 
 * @param {Object} props
 * @param {Function} props.onLoginSuccess - Callback when login is successful
 */
function Login({ onLoginSuccess }) {
  console.log("Login: Rendered");
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission and mock credentials verification.
   */
  async function handleSubmit(values) {
    console.log("Login: Attempting login for", values.email);
    setLoading(true);

    // Simulate network delay for realistic look and feel
    setTimeout(() => {
      const email = values.email.trim().toLowerCase();
      const password = values.password;

      if (email === "admin@bank.com" && password === "admin123") {
        console.log("Login: Authentication successful");
        message.success("Logged in successfully!");
        onLoginSuccess({ email });
      } else {
        console.warn("Login: Invalid credentials provided");
        message.error("Invalid email or password!");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div className={styles.loginContainer} id="loginPageWrapper">
      <div className={styles.loginCard} id="loginCard">
        <div className={styles.loginHeader}>
          <BankOutlined className={styles.logoIcon} />
          <h1 className={styles.loginTitle}>Global Trust Bank</h1>
          <p className={styles.loginSubtitle}>Sign in to manage customers & transactions</p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          id="loginForm"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="admin@bank.com"
              id="inputLoginEmail"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="••••••••"
              id="inputLoginPassword"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.loginBtn}
              id="btnLoginSubmit"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.credentialsInfo} id="loginCredentialsTip">
          <div className={styles.credentialsTitle}>🔑 Demo Access Credentials:</div>
          <div><strong>Email:</strong> admin@bank.com</div>
          <div><strong>Password:</strong> admin123</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
