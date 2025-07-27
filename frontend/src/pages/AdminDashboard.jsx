import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showAllHosts, setShowAllHosts] = useState(false);
  const [showPendingHosts, setShowPendingHosts] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [pendingHosts, setPendingHosts] = useState([]);
  const [hostsLoading, setHostsLoading] = useState(false);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login first.");
        return;
      }

      const response = await fetch(
        "http://localhost:5500/api/v1/auth/admin/statistics",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatistics(data.data);
        setLastUpdated(new Date().toLocaleString());
        setError(null);
      } else {
        if (response.status === 403) {
          setError("Access denied. Admin privileges required.");
        } else if (response.status === 401) {
          setError("Authentication failed. Please login again.");
        } else {
          setError(data.message || "Failed to fetch statistics");
        }
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHosts = async () => {
    try {
      setHostsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch("http://localhost:5500/api/v1/hosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setHosts(data.data);
      } else {
        setError("Failed to fetch hosts");
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
      setError(`Network error: ${error.message}`);
    } finally {
      setHostsLoading(false);
    }
  };

  const fetchPendingHosts = async () => {
    try {
      setHostsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        "http://localhost:5500/api/v1/hosts/pending",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setPendingHosts(data.data);
      } else {
        setError("Failed to fetch pending hosts");
      }
    } catch (error) {
      console.error("Error fetching pending hosts:", error);
      setError(`Network error: ${error.message}`);
    } finally {
      setHostsLoading(false);
    }
  };

  const updateHostStatus = async (hostId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        `http://localhost:5500/api/v1/hosts/${hostId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Refresh the lists and statistics
        fetchStatistics();
        if (showPendingHosts) {
          fetchPendingHosts();
        }
        if (showAllHosts) {
          fetchAllHosts();
        }
      } else {
        setError("Failed to update host status");
      }
    } catch (error) {
      console.error("Error updating host status:", error);
      setError(`Network error: ${error.message}`);
    }
  };

  const handleShowAllHosts = () => {
    setShowPendingHosts(false);
    setShowAllHosts(true);
    fetchAllHosts();
  };

  const handleShowPendingHosts = () => {
    setShowAllHosts(false);
    setShowPendingHosts(true);
    fetchPendingHosts();
  };

  const handleBackToDashboard = () => {
    setShowAllHosts(false);
    setShowPendingHosts(false);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-xl text-navy/70">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, bgColor, textColor }) => (
    <div
      className={`${bgColor} rounded-lg shadow-lg p-6 transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          {subtitle && (
            <p className={`text-sm ${textColor} opacity-80 mt-1`}>{subtitle}</p>
          )}
        </div>
        <div className={`text-4xl ${textColor} opacity-60`}>{icon}</div>
      </div>
    </div>
  );

  const HostCard = ({ host, showActions = false, onApprove, onReject }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-ash">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-navy">
            {host.fullName}
          </h3>
          <p className="text-navy/70">@{host.username}</p>
          <p className="text-navy/70">{host.email}</p>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              host.status === "approved"
                ? "bg-green-100 text-green-800"
                : host.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {host.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-navy/70 mb-4">
        <div>
          <strong>Property Type:</strong> {host.propertyType}
        </div>
        <div>
          <strong>Phone:</strong> {host.phone}
        </div>
        <div>
          <strong>City:</strong> {host.city}
        </div>
        <div>
          <strong>Postal Code:</strong> {host.postalCode}
        </div>
      </div>

      <div className="mb-4">
        <strong className="text-sm text-navy/70">Address:</strong>
        <p className="text-sm text-navy">
          {host.boardingAddressForApproval}
        </p>
      </div>

      <div className="mb-4">
        <strong className="text-sm text-navy/70">Description:</strong>
        <p className="text-sm text-navy">{host.description}</p>
      </div>

      {host.boardingImageForApproval && (
        <div className="mb-4">
          <img
            src={host.boardingImageForApproval}
            alt="Boarding property"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {showActions && host.status === "pending" && (
        <div className="flex space-x-2">
          <button
            onClick={() => onApprove(host._id)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(host._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );

  // If showing all hosts
  if (showAllHosts) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-navy">All Hosts</h1>
            <button
              onClick={handleBackToDashboard}
              className="bg-ash hover:bg-ash/80 text-navy px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>

          {hostsLoading ? (
            <div className="text-center py-8">
              <div className="text-xl text-navy/70">Loading hosts...</div>
            </div>
          ) : hosts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-navy/70">No hosts found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hosts.map((host) => (
                <HostCard key={host._id} host={host} />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // If showing pending hosts
  if (showPendingHosts) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-navy">
              Pending Host Approvals
            </h1>
            <button
              onClick={handleBackToDashboard}
              className="bg-ash hover:bg-ash/80 text-navy px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>

          {hostsLoading ? (
            <div className="text-center py-8">
              <div className="text-xl text-navy/70">
                Loading pending hosts...
              </div>
            </div>
          ) : pendingHosts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-navy/70">No pending host approvals.</div>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingHosts.map((host) => (
                <HostCard
                  key={host._id}
                  host={host}
                  showActions={true}
                  onApprove={(id) => updateHostStatus(id, "approved")}
                  onReject={(id) => updateHostStatus(id, "rejected")}
                />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy mb-2">
            Admin Dashboard
          </h1>
          <p className="text-navy/70">
            Welcome to the UniNest admin panel. Here's an overview of your
            platform statistics.
          </p>
          {lastUpdated && (
            <p className="text-sm text-navy/50 mt-2">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* Host Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-navy mb-4">
            Host Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Approved Hosts"
              value={statistics?.hosts?.approved || 0}
              subtitle="Active hosts on platform"
              icon="✅"
              bgColor="bg-green-50 border border-green-200"
              textColor="text-green-700"
            />
            <StatCard
              title="Pending Approval"
              value={statistics?.hosts?.pending || 0}
              subtitle="Awaiting review"
              icon="⏳"
              bgColor="bg-yellow-50 border border-yellow-200"
              textColor="text-yellow-700"
            />
            <StatCard
              title="Total Hosts"
              value={statistics?.hosts?.total || 0}
              subtitle="All registered hosts"
              icon="👥"
              bgColor="bg-blue-50 border border-blue-200"
              textColor="text-blue-700"
            />
          </div>
        </div>

        {/* Approved Boarding Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-navy mb-4">
            Approved Boarding Statistics
          </h2>
          <p className="text-navy/70 mb-4 text-sm">
            These are all the approved boarding listings available on the
            platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Hostels"
              value={statistics?.boardings?.hostel || 0}
              subtitle="Available hostel listings"
              icon="🏢"
              bgColor="bg-purple-50 border border-purple-200"
              textColor="text-purple-700"
            />
            <StatCard
              title="Annexes"
              value={statistics?.boardings?.annex || 0}
              subtitle="Available annex listings"
              icon="🏘️"
              bgColor="bg-indigo-50 border border-indigo-200"
              textColor="text-indigo-700"
            />
            <StatCard
              title="Homestays"
              value={statistics?.boardings?.homestay || 0}
              subtitle="Available homestay listings"
              icon="🏠"
              bgColor="bg-pink-50 border border-pink-200"
              textColor="text-pink-700"
            />
            <StatCard
              title="Total Boardings"
              value={statistics?.boardings?.total || 0}
              subtitle="All approved listings"
              icon="📊"
              bgColor="bg-ash border border-ash"
              textColor="text-navy"
            />
          </div>
        </div>

        {/* Summary Charts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-navy mb-4">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Boarding Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-ash">
              <h3 className="text-lg font-semibold text-navy mb-4">
                Boarding Types Distribution
              </h3>
              <div className="space-y-3">
                {statistics?.boardings?.total > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700">🏢 Hostels</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-ash rounded-full h-2 mr-3">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (statistics.boardings.hostel /
                                  statistics.boardings.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-navy/70">
                          {(
                            (statistics.boardings.hostel /
                              statistics.boardings.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-700">🏘️ Annexes</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-ash rounded-full h-2 mr-3">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (statistics.boardings.annex /
                                  statistics.boardings.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-navy/70">
                          {(
                            (statistics.boardings.annex /
                              statistics.boardings.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-700">🏠 Homestays</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-ash rounded-full h-2 mr-3">
                          <div
                            className="bg-pink-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (statistics.boardings.homestay /
                                  statistics.boardings.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-navy/70">
                          {(
                            (statistics.boardings.homestay /
                              statistics.boardings.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-navy/50 py-8">
                    No approved boardings yet
                  </div>
                )}
              </div>
            </div>

            {/* Host Status Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-ash">
              <h3 className="text-lg font-semibold text-navy mb-4">
                Host Status Distribution
              </h3>
              <div className="space-y-3">
                {statistics?.hosts?.total > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">✅ Approved</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-ash rounded-full h-2 mr-3">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (statistics.hosts.approved /
                                  statistics.hosts.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-navy/70">
                          {(
                            (statistics.hosts.approved /
                              statistics.hosts.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700">⏳ Pending</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-ash rounded-full h-2 mr-3">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (statistics.hosts.pending /
                                  statistics.hosts.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-navy/70">
                          {(
                            (statistics.hosts.pending /
                              statistics.hosts.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-navy/50 py-8">
                    No registered hosts yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-navy mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
              onClick={handleShowPendingHosts}
            >
              <span className="mr-2">⏳</span>
              Review Pending Hosts ({statistics?.hosts?.pending || 0})
            </button>
            <button
              className="bg-navy hover:bg-navy/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
              onClick={handleShowAllHosts}
            >
              <span className="mr-2">👥</span>
              Manage All Hosts
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
              onClick={fetchStatistics}
            >
              <span className="mr-2">🔄</span>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
