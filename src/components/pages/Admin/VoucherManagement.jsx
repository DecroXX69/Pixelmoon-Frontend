// src/components/Admin/VoucherManagement.jsx

import React, { useState, useEffect } from 'react';
import styles from './VoucherManagement.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const VoucherManagement = () => {
  // ─── Tabs: 'list', 'create-json', 'create-csv' ───
  const [activeTab, setActiveTab] = useState('list');

  // ─── LIST state ───
  const [vouchers, setVouchers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState(null);
  const [filter, setFilter] = useState({ type: '', status: 'active', page: 1, limit: 25 });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ─── CREATE (JSON rows) state ───
  const [rows, setRows] = useState([{ code: '', type: 'smileone', denomination: '', price: '' }]);
  const [creatingJSON, setCreatingJSON] = useState(false);
  const [createJSONResult, setCreateJSONResult] = useState(null);
  const [createJSONError, setCreateJSONError] = useState(null);

  // ─── CREATE (CSV) state ───
  const [csvFile, setCsvFile] = useState(null);
  const [creatingCSV, setCreatingCSV] = useState(false);
  const [createCSVResult, setCreateCSVResult] = useState(null);
  const [createCSVError, setCreateCSVError] = useState(null);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
  });

  // ─── Fetch vouchers on filter change ───
  useEffect(() => {
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.page, filter.type, filter.status]);

  const fetchVouchers = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const params = new URLSearchParams(filter);
      const res = await fetch(`${API_URL}/vouchers?${params}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Fetch failed');
      setVouchers(data.vouchers || []);
      const total = data.totalCount ?? data.count ?? 0;
      setTotalCount(total);
      setTotalPages(data.totalPages ?? Math.ceil(total / filter.limit));
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };
  const handlePageChange = (p) => {
    if (p < 1 || p > totalPages) return;
    setFilter((prev) => ({ ...prev, page: p }));
  };

  // ─── Handlers for JSON Rows ───
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { code: '', type: 'smileone', denomination: '', price: '' }
    ]);
  };
  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };
  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleCreateJSONSubmit = async () => {
    // Validate rows are complete
    const invalids = rows.filter(
      (r) =>
        !r.code.trim() ||
        !r.type ||
        Number(r.denomination) <= 0 ||
        Number(r.price) <= 0
    );
    if (invalids.length > 0) {
      setCreateJSONError(
        'Each row requires a valid code, type, positive denomination, and price.'
      );
      return;
    }

    setCreatingJSON(true);
    setCreateJSONResult(null);
    setCreateJSONError(null);

    try {
      const payload = {
        vouchers: rows.map((r) => ({
          code: r.code.trim(),
          type: r.type,
          denomination: Number(r.denomination),
          price: Number(r.price)
        }))
      };

      const res = await fetch(`${API_URL}/vouchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Create failed');
      setCreateJSONResult(result);
      setRows([{ code: '', type: 'smileone', denomination: '', price: '' }]);
      if (activeTab === 'list') fetchVouchers();
    } catch (err) {
      setCreateJSONError(err.message);
    } finally {
      setCreatingJSON(false);
    }
  };

  // ─── Handlers for CSV Upload ───
  const onCsvFileChange = (e) => {
    setCsvFile(e.target.files[0] || null);
  };

  const handleCreateCSVSubmit = async () => {
    if (!csvFile) {
      setCreateCSVError('Please select a CSV file.');
      return;
    }
    setCreatingCSV(true);
    setCreateCSVResult(null);
    setCreateCSVError(null);

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const res = await fetch(`${API_URL}/vouchers`, {
        method: 'POST',
        headers: getAuthHeaders(), // no Content-Type: multipart/form-data is set automatically
        body: formData
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Upload failed');
      setCreateCSVResult(result);
      setCsvFile(null);
      document.getElementById('voucher-csv-input').value = '';
      if (activeTab === 'list') fetchVouchers();
    } catch (err) {
      setCreateCSVError(err.message);
    } finally {
      setCreatingCSV(false);
    }
  };

  // ─── Update / Delete in List ───
  const handleUpdateVoucher = async (id) => {
    const price = prompt('New price:');
    const status = prompt('New status (active/redeemed):');
    if (!price || !status) return;
    try {
      const res = await fetch(`${API_URL}/vouchers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ price: parseFloat(price), status })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      alert('Updated');
      fetchVouchers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteVoucher = async (id) => {
    if (!window.confirm('Delete this voucher?')) return;
    try {
      const res = await fetch(`${API_URL}/vouchers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      alert('Deleted');
      fetchVouchers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className={`container mt-4 ${styles.voucherManagement}`}>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            List Vouchers
          </button>
        </li>
        <li className="nav-item dropdown">
          <button
            className={`nav-link dropdown-toggle ${activeTab.startsWith('create') ? 'active' : ''}`}
            data-bs-toggle="dropdown"
          >
            Create Vouchers
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className={`dropdown-item ${activeTab === 'create-json' ? 'active' : ''}`}
                onClick={() => setActiveTab('create-json')}
              >
                JSON Rows
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${activeTab === 'create-csv' ? 'active' : ''}`}
                onClick={() => setActiveTab('create-csv')}
              >
                CSV Upload
              </button>
            </li>
          </ul>
        </li>
      </ul>

      {/* ─── LIST TAB ─── */}
      {activeTab === 'list' && (
        <>
          <div className="d-flex gap-3 mb-3 filters">
            <select
              className="form-select"
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="smileone">Smile.one</option>
              <option value="moo">MOO</option>
            </select>
            <select
              className="form-select"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
            >
              <option value="active">Active</option>
              <option value="redeemed">Redeemed</option>
            </select>
            <button
              className="btn btn-primary"
              onClick={fetchVouchers}
              disabled={loadingList}
            >
              Refresh
            </button>
          </div>

          {loadingList && <p>Loading…</p>}
          {listError && (
            <div className="alert alert-danger">{listError}</div>
          )}

          {!loadingList && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Denomination</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Uploaded At</th>
                    <th>Redeemed At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v._id}>
                      <td>{v.code}</td>
                      <td>{v.type}</td>
                      <td>{v.denomination}</td>
                      <td>{v.price}</td>
                      <td>{v.status}</td>
                      <td>
                        {new Date(v.uploadedAt).toLocaleString()}
                      </td>
                      <td>
                        {v.redeemedAt
                          ? new Date(v.redeemedAt).toLocaleString()
                          : '-'}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-link text-primary"
                          onClick={() => handleUpdateVoucher(v._id)}
                        >
                          Edit
                        </button>
                        {v.status === 'active' && (
                          <button
                            className="btn btn-sm btn-link text-danger"
                            onClick={() => handleDeleteVoucher(v._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {vouchers.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-3">
                        No vouchers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loadingList && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3 pagination">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(filter.page - 1)}
                disabled={filter.page === 1}
              >
                Prev
              </button>
              <span>
                Page {filter.page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(filter.page + 1)}
                disabled={filter.page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ─── CREATE (JSON Rows) ─── */}
      {activeTab === 'create-json' && (
        <div className="card p-4">
          <div className="d-flex justify-content-between mb-3">
            <h5>Create Vouchers (JSON Rows)</h5>
            <button className="btn btn-outline-secondary btn-sm" onClick={addRow}>
              + Add Row
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Denomination</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.code}
                        onChange={(e) =>
                          handleRowChange(idx, 'code', e.target.value)
                        }
                        placeholder="SMILE001"
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={row.type}
                        onChange={(e) =>
                          handleRowChange(idx, 'type', e.target.value)
                        }
                      >
                        <option value="smileone">Smile.one</option>
                        <option value="moo">MOO</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.denomination}
                        onChange={(e) =>
                          handleRowChange(idx, 'denomination', e.target.value)
                        }
                        placeholder="e.g. 5000"
                        min="1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={row.price}
                        onChange={(e) =>
                          handleRowChange(idx, 'price', e.target.value)
                        }
                        placeholder="e.g. 45.99"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeRow(idx)}
                        disabled={rows.length === 1}
                        title="Remove row"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {createJSONError && (
            <div className="alert alert-danger">{createJSONError}</div>
          )}
          {createJSONResult && (
            <div className="alert alert-success">
              <p>Inserted: {createJSONResult.insertedCount}</p>
              {createJSONResult.duplicates?.length > 0 && (
                <div>
                  <strong>Duplicates:</strong>
                  <ul>
                    {createJSONResult.duplicates.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {createJSONResult.invalid?.length > 0 && (
                <div>
                  <strong>Invalid:</strong>
                  <ul>
                    {createJSONResult.invalid.map((i, idx) => (
                      <li key={idx}>{JSON.stringify(i)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={handleCreateJSONSubmit}
              disabled={creatingJSON}
            >
              {creatingJSON ? 'Submitting…' : 'Submit All'}
            </button>
          </div>
        </div>
      )}

      {/* ─── CREATE (CSV Upload) ─── */}
      {activeTab === 'create-csv' && (
        <div className="card p-4">
          <h5>Upload Vouchers via CSV</h5>
          <input
            type="file"
            id="voucher-csv-input"
            className="form-control mb-2"
            accept=".csv"
            onChange={onCsvFileChange}
          />
          <button
            className="btn btn-success"
            onClick={handleCreateCSVSubmit}
            disabled={creatingCSV}
          >
            {creatingCSV ? 'Uploading…' : 'Upload CSV'}
          </button>

          {createCSVError && (
            <div className="alert alert-danger mt-3">{createCSVError}</div>
          )}
          {createCSVResult && (
            <div className="alert alert-success mt-3">
              <p>Inserted: {createCSVResult.insertedCount}</p>
              {createCSVResult.duplicates?.length > 0 && (
                <div>
                  <strong>Duplicates:</strong>
                  <ul>
                    {createCSVResult.duplicates.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {createCSVResult.invalid?.length > 0 && (
                <div>
                  <strong>Invalid:</strong>
                  <ul>
                    {createCSVResult.invalid.map((i, idx) => (
                      <li key={idx}>{JSON.stringify(i)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
