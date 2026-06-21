import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { createCustomer } from "../../services/CustomerService";
import styles from "./CustomerForm.module.css";

/**
 * CustomerForm component to create a new customer.
 * Uses Ant Design form validation.
 * 
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback triggered after customer is successfully created
 */
function CustomerForm({ onSuccess }) {
  console.log("CustomerForm: Rendered");
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  /**
   * Handle form submission.
   * Calls API via CustomerService.
   */
  async function handleSubmit(values) {
    console.log("CustomerForm: Form submitted with values", values);
    setSubmitting(true);
    
    const customerData = {
      c_name: values.name,
      c_email: values.email.toLowerCase().trim(),
      c_phone: values.phone.trim(),
    };

    try {
      await createCustomer(customerData);
      message.success("Customer created successfully!");
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("CustomerForm: Creation failed", error);
      message.error(error.message || "Failed to create customer");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.formContainer} id="customerFormWrapper">
      <h2 className={styles.formTitle}>Add New Customer</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        id="customerForm"
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the customer's name" },
            { min: 1, message: "Name must be at least 1 character" },
          ]}
        >
          <Input 
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />} 
            placeholder="E.g. John Doe" 
            id="inputCustomerName"
          />
        </Form.Item>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter the customer's email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input 
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />} 
            placeholder="E.g. john.doe@example.com" 
            id="inputCustomerEmail"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter the customer's phone number" },
            { pattern: /^\+?[0-9]{10,15}$/, message: "Please enter a valid phone number (at least 10 digits)" },
          ]}
        >
          <Input 
            prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />} 
            placeholder="E.g. 9876543210" 
            id="inputCustomerPhone"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            className={styles.submitBtn}
            id="btnSaveCustomer"
          >
            Save Customer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CustomerForm;
