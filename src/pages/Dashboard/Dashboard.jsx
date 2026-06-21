import React, { useState, useEffect } from "react";
import { Tabs, Button, Select, DatePicker, InputNumber, Table, Tag, message, Spin } from "antd";
import {
  PlusOutlined,
  FilterOutlined,
  ClearOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  DollarOutlined,
  CloseOutlined
} from "@ant-design/icons";
import Navbar from "../../components/Navbar/Navbar";
import CustomerTable from "../../components/CustomerTable/CustomerTable";
import CustomerForm from "../../components/CustomerForm/CustomerForm";
import { getAllCustomers, filterTransactions, getBranchCustomerCount } from "../../services/CustomerService";
import styles from "./Dashboard.module.css";

const { Option } = Select;

/**
 * Dashboard page component.
 * Manages states for customer list, filtered transactions, and branch statistics.
 * 
 * @param {Object} props
 * @param {Object} props.currentUser - Current logged-in user details
 * @param {Function} props.onLogout - Callback to log out the user
 */
function Dashboard({ currentUser, onLogout }) {
  console.log("Dashboard: Rendered");

  // Tab State
  const [activeTab, setActiveTab] = useState("customers");

  // Customers Tab States
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Transactions Filter Tab States
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterType, setFilterType] = useState(undefined);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minAmount, setMinAmount] = useState(null);

  // Branch Stats Tab States
  const [branchStats, setBranchStats] = useState([]);
  const [branchStatsLoading, setBranchStatsLoading] = useState(false);

  // ── HOOKS & INITIALIZATION ────────────────────────────────────────────────
  
  // Load initial customer directory on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch data dynamically on tab switch
  useEffect(() => {
    if (activeTab === "branch-stats") {
      fetchBranchStats();
    } else if (activeTab === "transactions") {
      handleFilterTransactions();
    }
  }, [activeTab]);

  // ── CUSTOMERS ACTIONS ──────────────────────────────────────────────────────
  
  /**
   * Fetch all customers from backend and update state.
   */
  async function fetchCustomers() {
    console.log("Dashboard: Fetching customers...");
    setCustomersLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Dashboard: Error fetching customers", error);
      message.error(error.message || "Failed to fetch customers directory");
    } finally {
      setCustomersLoading(false);
    }
  }

  // ── TRANSACTIONS FILTER ACTIONS ────────────────────────────────────────────
  
  /**
   * Filter transactions based on date, type, and minimum amount.
   */
  async function handleFilterTransactions() {
    console.log("Dashboard: Running transaction filter query...");
    setFilterLoading(true);

    const params = {
      transaction_type: filterType,
      start_date: startDate ? startDate.format("YYYY-MM-DD") : undefined,
      end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,
      min_amount: minAmount,
    };

    try {
      const data = await filterTransactions(params);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Dashboard: Error filtering transactions", error);
      message.error(error.message || "Failed to filter transactions");
    } finally {
      setFilterLoading(false);
    }
  }

  /**
   * Clear transaction filter inputs.
   */
  function handleClearFilters() {
    console.log("Dashboard: Clearing transaction filters");
    setFilterType(undefined);
    setStartDate(null);
    setEndDate(null);
    setMinAmount(null);
    // Refresh with empty parameters
    setFilterLoading(true);
    filterTransactions({})
      .then((data) => {
        setFilteredTransactions(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFilterLoading(false);
      });
  }

  // ── BRANCH STATS ACTIONS ───────────────────────────────────────────────────
  
  /**
   * Fetch branch customer statistics from backend.
   */
  async function fetchBranchStats() {
    console.log("Dashboard: Fetching branch statistics...");
    setBranchStatsLoading(true);
    try {
      const data = await getBranchCustomerCount();
      setBranchStats(data);
    } catch (error) {
      console.error("Dashboard: Error fetching branch stats", error);
      message.error(error.message || "Failed to fetch branch statistics");
    } finally {
      setBranchStatsLoading(false);
    }
  }

  // ── TAB ITEMS CONFIG ───────────────────────────────────────────────────────
  
  // Columns for Transaction Filter Table
  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "t_id",
      key: "t_id",
      sorter: (a, b) => a.t_id - b.t_id,
    },
    {
      title: "Account ID",
      dataIndex: "t_account_id",
      key: "t_account_id",
    },
    {
      title: "Transaction Type",
      dataIndex: "t_transaction_type",
      key: "t_transaction_type",
      render: (type) => {
        const color = type === "Deposit" ? "green" : "volcano";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "t_amount",
      key: "t_amount",
      sorter: (a, b) => a.t_amount - b.t_amount,
      render: (amount, record) => {
        const colorStyle = record.t_transaction_type === "Deposit" ? "#52c41a" : "#f5222d";
        const prefix = record.t_transaction_type === "Deposit" ? "+" : "-";
        return <span style={{ color: colorStyle, fontWeight: "600" }}>{prefix}${amount.toFixed(2)}</span>;
      },
    },
    {
      title: "Transaction Date",
      dataIndex: "t_transaction_date",
      key: "t_transaction_date",
      sorter: (a, b) => new Date(a.t_transaction_date) - new Date(b.t_transaction_date),
    },
  ];

  const tabItems = [
    {
      key: "customers",
      label: (
        <span>
          <TeamOutlined />
          Customers
        </span>
      ),
      children: (
        <div className={styles.tabCard}>
          <div className={styles.dashboardHeader}>
            <h2 className={styles.dashboardTitle}>Dashboard</h2>
            <Button
              type="primary"
              icon={showAddForm ? <CloseOutlined /> : <PlusOutlined />}
              onClick={() => setShowAddForm(!showAddForm)}
              className={styles.createBtn}
              id="btnToggleCustomerForm"
            >
              {showAddForm ? "Hide Form" : "Create Customer"}
            </Button>
          </div>

          {showAddForm && (
            <div className={styles.formSection}>
              <CustomerForm
                onSuccess={() => {
                  setShowAddForm(false);
                  fetchCustomers();
                }}
              />
            </div>
          )}

          <CustomerTable
            customers={customers}
            loading={customersLoading}
            onRefresh={fetchCustomers}
          />
        </div>
      ),
    },
    {
      key: "transactions",
      label: (
        <span>
          <DollarOutlined />
          Transaction Filter
        </span>
      ),
      children: (
        <div className={styles.tabCard}>
          <div className={styles.filterForm}>
            <div className={styles.filterTitle}>
              <FilterOutlined /> Search & Filter Transactions
            </div>
            
            <div className={styles.filterControls}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#595959" }}>
                  Transaction Type
                </label>
                <Select
                  placeholder="Select type"
                  value={filterType}
                  onChange={(val) => setFilterType(val)}
                  style={{ width: "100%" }}
                  allowClear
                  id="selectFilterType"
                >
                  <Option value="Deposit">Deposit</Option>
                  <Option value="Withdrawal">Withdrawal</Option>
                </Select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#595959" }}>
                  Start Date
                </label>
                <DatePicker
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  style={{ width: "100%" }}
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  id="pickerStartDate"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#595959" }}>
                  End Date
                </label>
                <DatePicker
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  style={{ width: "100%" }}
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  id="pickerEndDate"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#595959" }}>
                  Minimum Amount
                </label>
                <InputNumber
                  value={minAmount}
                  onChange={(val) => setMinAmount(val)}
                  style={{ width: "100%" }}
                  placeholder="Min $"
                  min={0}
                  id="inputMinAmount"
                />
              </div>
            </div>

            <div className={styles.filterButtons}>
              <Button icon={<ClearOutlined />} onClick={handleClearFilters} id="btnResetFilters">
                Reset
              </Button>
              <Button type="primary" icon={<FilterOutlined />} onClick={handleFilterTransactions} id="btnApplyFilters">
                Apply Filters
              </Button>
            </div>
          </div>

          <Table
            dataSource={filteredTransactions}
            columns={transactionColumns}
            rowKey="t_id"
            loading={filterLoading}
            pagination={{ pageSize: 10 }}
            bordered
            locale={{ emptyText: "No transactions found matching the filter." }}
            id="tblFilteredTx"
          />
        </div>
      ),
    },
    {
      key: "branch-stats",
      label: (
        <span>
          <EnvironmentOutlined />
          Branch Statistics
        </span>
      ),
      children: (
        <div className={styles.tabCard}>
          <h2 className={styles.dashboardTitle} style={{ marginBottom: 24 }}>Branch Customer Directory</h2>
          
          {branchStatsLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin size="large" tip="Loading statistics..." />
            </div>
          ) : (
            <div className={styles.branchGrid} id="branchStatsGrid">
              {branchStats.map((branch, index) => (
                <div key={index} className={styles.branchCard} id={`branchCard-${index}`}>
                  <div className={styles.branchName}>{branch.branch_name}</div>
                  <div className={styles.branchCity}>
                    <EnvironmentOutlined /> {branch.branch_city}
                  </div>
                  <div className={styles.branchStats}>
                    <span className={styles.statsLabel}>Total Customers</span>
                    <span className={styles.statsValue}>{branch.customer_count}</span>
                  </div>
                </div>
              ))}
              {branchStats.length === 0 && (
                <div style={{ textAlign: "center", gridColumn: "1 / -1", color: "#8c8c8c", padding: "20px 0" }}>
                  No branch statistics available.
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <div className={styles.dashboardContainer} id="dashboardContent">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          type="line"
          size="large"
          style={{ marginBottom: 32 }}
          id="dashboardTabs"
        />
      </div>
    </div>
  );
}

export default Dashboard;
