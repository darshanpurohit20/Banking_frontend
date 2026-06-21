import { API_BASE_URL } from "../data/config";

/**
 * Fetch all customers from the backend.
 * Endpoint: GET /customers
 */
export async function getAllCustomers() {
    console.log("CustomerService: Fetching all customers");
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch customers");
    }
    return response.json();
}

/**
 * Create a new customer in the backend.
 * Endpoint: POST /customers
 * @param {Object} customerData - { c_name, c_email, c_phone }
 */
export async function createCustomer(customerData) {
    console.log("CustomerService: Creating customer", customerData);
    const response = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create customer");
    }
    return response.json();
}

/**
 * Delete a customer by phone number.
 * Endpoint: DELETE /customers/{customer_phone}
 * @param {string} customerPhone
 */
export async function deleteCustomer(customerPhone) {
    console.log("CustomerService: Deleting customer with phone:", customerPhone);
    const response = await fetch(`${API_BASE_URL}/customers/${customerPhone}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete customer");
    }
    return response.json();
}

/**
 * Update the phone number of a customer.
 * Endpoint: PUT /customers/{customer_phone}/phone
 * @param {string} customerPhone - Current phone number
 * @param {Object} data - { c_phone: newPhone }
 */
export async function updateCustomerPhone(customerPhone, data) {
    console.log("CustomerService: Updating customer phone from", customerPhone, "to", data.c_phone);
    const response = await fetch(`${API_BASE_URL}/customers/${customerPhone}/phone`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update phone number");
    }
    return response.json();
}

/**
 * Get all transactions performed by a specific customer.
 * Endpoint: GET /customers/{customer_id}/transactions
 * @param {number} customerId
 */
export async function getCustomerTransactions(customerId) {
    console.log("CustomerService: Fetching transactions for customer ID:", customerId);
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/transactions`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch transactions");
    }
    return response.json();
}

/**
 * Filter transactions based on date, type, and min amount.
 * Endpoint: GET /transactions/filter
 * @param {Object} params - { transaction_type, start_date, end_date, min_amount }
 */
export async function filterTransactions(params = {}) {
    console.log("CustomerService: Filtering transactions with params:", params);
    
    // Construct query string manually for simplicity
    const queryParts = [];
    if (params.transaction_type) {
        queryParts.push(`transaction_type=${encodeURIComponent(params.transaction_type)}`);
    }
    if (params.start_date) {
        queryParts.push(`start_date=${encodeURIComponent(params.start_date)}`);
    }
    if (params.end_date) {
        queryParts.push(`end_date=${encodeURIComponent(params.end_date)}`);
    }
    if (params.min_amount !== undefined && params.min_amount !== null && params.min_amount !== "") {
        queryParts.push(`min_amount=${encodeURIComponent(params.min_amount)}`);
    }
    
    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    const response = await fetch(`${API_BASE_URL}/transactions/filter${queryString}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to filter transactions");
    }
    return response.json();
}

/**
 * Get the count of customers per branch.
 * Endpoint: GET /branches/customer-count
 */
export async function getBranchCustomerCount() {
    console.log("CustomerService: Fetching branch customer counts");
    const response = await fetch(`${API_BASE_URL}/branches/customer-count`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch branch customer count");
    }
    return response.json();
}