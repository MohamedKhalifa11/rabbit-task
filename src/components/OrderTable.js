import { useEffect, useState } from "react";
import { orders } from "../data/orders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faMoon,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const OrderTable = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const columns = [
    "Order ID",
    "Customer Name",
    "Order Status",
    "Order Items",
    "Created At",
  ];

  useEffect(() => {
    // Check if theme preference is saved in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  // Filter orders based on their status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Sort orders based on createdAt field
  const sortOrdersByDate = (orders) => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      if (newTheme) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      return newTheme;
    });
  };

  return (
    <div className="container">
      <div className="order-controls">
        <div className="search-wrapper">
          {searchTerm ? (
            <FontAwesomeIcon
              onClick={clearSearch}
              className="xmark-icon"
              icon={faXmark}
            />
          ) : (
            <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
          )}
          <input
            className="search-input"
            type="text"
            placeholder="Search by Name or ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <select
          className="filter"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="New">New</option>
          <option value="Picking">Picking</option>
          <option value="Delivering">Delivering</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button className="sort-btn" onClick={toggleSortOrder}>
          Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
        <button onClick={toggleTheme} className="theme-btn">
          Switch to{" "}
          {isDarkMode ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortOrdersByDate(filteredOrders).length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="no-orders">
                No orders found
              </td>
            </tr>
          ) : (
            sortOrdersByDate(filteredOrders).map((order) => (
              <tr key={order.id}>
                <td data-label={columns[0]}>{order.id}</td>
                <td data-label={columns[1]}>{order.customerName}</td>
                <td
                  data-label={columns[2]}
                  className={`status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </td>
                <td data-label={columns[3]}>{order.items.join(", ")}</td>
                <td data-label={columns[4]}>{order.createdAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
