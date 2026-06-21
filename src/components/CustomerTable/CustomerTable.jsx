import React, { useState } from "react";
import { Table, Button, Popconfirm, Modal, Form, Input, Space, Tag, message } from "antd";
import { EditOutlined, DeleteOutlined, HistoryOutlined, ReloadOutlined } from "@ant-design/icons";
import { deleteCustomer, updateCustomerPhone, getCustomerTransactions } from "../../services/CustomerService";
import styles from "./CustomerTable.module.css";

/**
 * CustomerTable component displaying customer list and actions.
 * 
 * @param {Object} props
 * @param {Array} props.customers - List of customer objects
 * @param {boolean} props.loading - Loading state of the table
 * @param {Function} props.onRefresh - Callback to refresh customer list
 */
function CustomerTable({ customers, loading, onRefresh }) {
  console.log("CustomerTable: Rendered", { count: customers.length, loading });

  // States for Edit Phone Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm] = Form.useForm();
  const [updatingPhone, setUpdatingPhone] = useState(false);

  // States for Transactions Modal
  const [isTxModalVisible, setIsTxModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  /**
   * Handle deleting a customer.
   */
  async function handleDelete(customerPhone) {
    console.log("CustomerTable: Deleting customer with phone", customerPhone);
    try {
      await deleteCustomer(customerPhone);
      message.success("Customer deleted successfully!");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("CustomerTable: Delete failed", error);
      message.error(error.message || "Failed to delete customer");
    }
  }

  /**
   * Open edit phone modal.
   */
  function openEditModal(customer) {
    console.log("CustomerTable: Opening edit phone modal for", customer);
    setEditingCustomer(customer);
    editForm.setFieldsValue({ phone: customer.c_phone });
    setIsEditModalVisible(true);
  }

  /**
   * Submit phone update.
   */
  async function handlePhoneUpdate(values) {
    console.log("CustomerTable: Updating phone", values);
    setUpdatingPhone(true);
    try {
      await updateCustomerPhone(editingCustomer.c_phone, { c_phone: values.phone.trim() });
      message.success("Customer phone updated successfully!");
      setIsEditModalVisible(false);
      setEditingCustomer(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("CustomerTable: Phone update failed", error);
      message.error(error.message || "Failed to update phone number");
    } finally {
      setUpdatingPhone(false);
    }
  }

  /**
   * Open and fetch transactions modal.
   */
  async function openTransactionsModal(customer) {
    console.log("CustomerTable: Fetching transactions for customer", customer.c_id);
    setSelectedCustomer(customer);
    setIsTxModalVisible(true);
    setTxLoading(true);
    setTransactions([]);

    try {
      const data = await getCustomerTransactions(customer.c_id);
      setTransactions(data);
    } catch (error) {
      console.error("CustomerTable: Fetching transactions failed", error);
      message.error(error.message || "Failed to load transactions");
    } finally {
      setTxLoading(false);
    }
  }

  // Ant Design Table Columns for Customers
  const columns = [
    {
      title: "ID",
      dataIndex: "c_id",
      key: "c_id",
      sorter: (a, b) => a.c_id - b.c_id,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "c_name",
      key: "c_name",
      sorter: (a, b) => a.c_name.localeCompare(b.c_name),
    },
    {
      title: "Email Address",
      dataIndex: "c_email",
      key: "c_email",
    },
    {
      title: "Phone Number",
      dataIndex: "c_phone",
      key: "c_phone",
    },
    {
      title: "Actions",
      key: "actions",
      width: 320,
      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            className={styles.actionBtn}
            id={`btnEditPhone-${record.c_id}`}
          >
            Edit Phone
          </Button>
          <Button
            type="default"
            icon={<HistoryOutlined />}
            onClick={() => openTransactionsModal(record)}
            className={styles.actionBtn}
            id={`btnViewTx-${record.c_id}`}
          >
            Transactions
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.c_phone)}
            okText="Yes"
            cancelText="No"
            id={`confirmDelete-${record.c_id}`}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionBtn}
              id={`btnDeleteCustomer-${record.c_id}`}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Ant Design Table Columns for Transactions modal
  const txColumns = [
    {
      title: "Transaction ID",
      dataIndex: "t_id",
      key: "t_id",
      width: 130,
    },
    {
      title: "Account ID",
      dataIndex: "t_account_id",
      key: "t_account_id",
      width: 110,
    },
    {
      title: "Type",
      dataIndex: "t_transaction_type",
      key: "t_transaction_type",
      width: 120,
      render: (type) => {
        const color = type === "Deposit" ? "green" : "volcano";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "t_amount",
      key: "t_amount",
      render: (amount, record) => {
        const className = record.t_transaction_type === "Deposit" ? styles.amountDeposit : styles.amountWithdrawal;
        const prefix = record.t_transaction_type === "Deposit" ? "+" : "-";
        return <span className={className}>{prefix}${amount.toFixed(2)}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "t_transaction_date",
      key: "t_transaction_date",
      render: (date) => <span className={styles.transactionDate}>{date}</span>,
    },
  ];

  return (
    <div id="customerTableWrapper">
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>Customer Directory</h3>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          className={styles.loadBtn}
          id="btnReloadCustomers"
        >
          Reload Customers
        </Button>
      </div>

      <Table
        dataSource={customers}
        columns={columns}
        rowKey="c_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
        id="tblCustomers"
      />

      {/* Edit Phone Modal */}
      <Modal
        title="Update Phone Number"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingCustomer(null);
        }}
        footer={null}
        destroyOnClose
        id="modalEditPhone"
      >
        {editingCustomer && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handlePhoneUpdate}
            id="formEditPhone"
          >
            <div style={{ marginBottom: 16 }}>
              <strong>Customer:</strong> {editingCustomer.c_name}
            </div>
            <Form.Item
              label="New Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter the new phone number" },
                { pattern: /^\+?[0-9]{10,15}$/, message: "Please enter a valid phone number (at least 10 digits)" },
              ]}
            >
              <Input placeholder="E.g. 9876543210" id="inputNewPhone" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={() => setIsEditModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={updatingPhone} id="btnSubmitNewPhone">
                  Update
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* View Customer Transactions Modal */}
      <Modal
        title={selectedCustomer ? `Transaction History - ${selectedCustomer.c_name}` : "Transaction History"}
        open={isTxModalVisible}
        onCancel={() => {
          setIsTxModalVisible(false);
          setSelectedCustomer(null);
        }}
        width={700}
        footer={[
          <Button key="close" onClick={() => setIsTxModalVisible(false)}>
            Close
          </Button>,
        ]}
        destroyOnClose
        id="modalCustomerTx"
      >
        <Table
          dataSource={transactions}
          columns={txColumns}
          rowKey="t_id"
          loading={txLoading}
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No transactions found for this customer." }}
          bordered
          id="tblCustomerTx"
        />
      </Modal>
    </div>
  );
}

export default CustomerTable;
