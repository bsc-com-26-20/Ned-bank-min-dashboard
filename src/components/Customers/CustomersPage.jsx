import React, { useState, useEffect } from "react";
import { fetchCustomers, createCustomer, fetchCustomerAccounts } from "./customers";
import "./CustomersPage.css";
import AccountsList from "../Accounts/AccountsList";

function CustomersPage({ refreshDashboard }) { // ✅ accept refreshDashboard prop
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    national_id: "",
    phone: "",
    email: "",
    address: "",
    date_of_birth: "",
    kyc_verified: false,
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await fetchCustomers();
    setCustomers(Array.isArray(data) ? data : data.customers || []);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.national_id || !form.phone) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    let dob = form.date_of_birth;
    if (dob.includes("/")) {
      const [day, month, year] = dob.split("/");
      dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const payload = {
      ...form,
      date_of_birth: dob
    };

    const data = await createCustomer(form);
    if (data.customer) {
      setMessage("✅ Customer created!");
      setForm({
        first_name: "",
        last_name: "",
        national_id: "",
        phone: "",
        email: "",
        address: "",
        date_of_birth: "",
        kyc_verified: false,
      });
      loadCustomers();

      // ✅ Refresh dashboard stats & recent transactions
      if (refreshDashboard) refreshDashboard();
    } else {
      setMessage("❌ Failed to create customer");
    }
  };

  const handleViewAccounts = async (customerId) => {
    const data = await fetchCustomerAccounts(customerId);
    setSelectedCustomer(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="customers-container">
      <h2>Customer Management</h2>

      {/* New Customer Form */}
      <form onSubmit={handleSubmit} className="customer-form">
        <input type="text" name="first_name" placeholder="First Name *"
          value={form.first_name} onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name *"
          value={form.last_name} onChange={handleChange} />
        <input type="text" name="national_id" placeholder="National ID *"
          value={form.national_id} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone *"
          value={form.phone} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address"
          value={form.address} onChange={handleChange} />
        <input type="date" name="date_of_birth"
          value={form.date_of_birth} onChange={handleChange} />
        <label>
          <input type="checkbox" name="kyc_verified"
            checked={form.kyc_verified} onChange={handleChange} /> KYC Verified
        </label>
        <button type="submit">➕ Add Customer</button>
      </form>

      <p className="message">{message}</p>

      {/* Customers List */}
      <h3>Customers List</h3>
      <div className="customers-grid">
        {customers.map((c) => (
          <div key={c.id} className="customer-card">
            <div className="card-header">
              <strong>{c.first_name} {c.last_name}</strong>
            </div>
            <div className="card-body">
              <p>📧 {c.email || "N/A"}</p>
              <p>📱 {c.phone}</p>
              <p>🆔 {c.national_id}</p>
            </div>
            <div className="card-footer">
              <button onClick={() => handleViewAccounts(c.id)}>View Accounts</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Accounts */}
      {showModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>✖</button>
            <AccountsList
              customer={selectedCustomer}
              accounts={selectedCustomer.accounts || []}
              onAccountCreated={(newAccount) => {
                setSelectedCustomer((prev) => ({
                  ...prev,
                  accounts: [...(prev.accounts || []), newAccount],
                }));
                // ✅ Refresh dashboard when a new account is created
                refreshDashboard={refreshDashboard}
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersPage;
