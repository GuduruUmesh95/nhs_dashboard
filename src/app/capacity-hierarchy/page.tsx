'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchHierarchy, saveHierarchy, getUnique } from '@/lib/data';
import type { HierarchyPerson } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Users, Download, Plus, Edit2, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function CapacityHierarchyPage() {
  const [hierarchy, setHierarchy] = useState<HierarchyPerson[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fSearch, setFSearch] = useState('');
  const [fRegion, setFRegion] = useState('');
  const [fLead, setFLead] = useState('');
  const [fStatus, setFStatus] = useState('Active'); // Default to active users

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<Partial<HierarchyPerson> | null>(null);

  // Pagination State
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(25);

  useEffect(() => {
    fetchHierarchy().then(d => {
      setHierarchy(d);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return hierarchy.filter(r =>
      (!fRegion || r.NHSRegion === fRegion) &&
      (!fLead || r.TeamLead === fLead) &&
      (!fStatus || r.UserStatus === fStatus) &&
      (!fSearch || [r.Name, r.UserID, r.Email].some(v => v.toLowerCase().includes(fSearch.toLowerCase())))
    );
  }, [hierarchy, fRegion, fLead, fStatus, fSearch]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const rows = filtered.slice(page * perPage, (page + 1) * perPage);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
      'User ID': r.UserID,
      'Name': r.Name,
      'Email': r.Email,
      'Role': r.Role,
      'Title': r.Title,
      'Region': r.NHSRegion,
      'Location': r.Location,
      'Team Lead': r.TeamLead,
      'Senior Lead': r.SeniorLead,
      'Director': r.Director,
      'Department Head': r.HeadOfDepartment,
      'Status': r.UserStatus,
      'Target Utilization': r.TargetUtilization
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Capacity_Hierarchy');
    saveAs(new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })]), 'Capacity_Hierarchy.xlsx');
  };

  const resetFilters = () => {
    setFSearch('');
    setFRegion('');
    setFLead('');
    setFStatus('');
  };

  const handleSaveUser = () => {
    if (!editUser?.Name || !editUser?.UserID) return;
    
    let updated: HierarchyPerson[];
    if (editUser.HierarchyID) {
      // Edit existing
      updated = hierarchy.map(h => h.HierarchyID === editUser.HierarchyID ? editUser as HierarchyPerson : h);
    } else {
      // Add new
      const newId = Math.max(...hierarchy.map(h => h.HierarchyID), 0) + 1;
      updated = [...hierarchy, { ...editUser, HierarchyID: newId } as HierarchyPerson];
    }
    
    setHierarchy(updated);
    saveHierarchy(updated);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setEditUser({
      UserID: `HRA0${Math.max(...hierarchy.map(h => parseInt(h.UserID.replace('HRA', '')) || 0), 0) + 1}`,
      Name: '', Email: '', Role: 'Research Analyst', Title: 'Research Analyst',
      NHSRegion: 'South West', Location: 'Remote',
      TeamLead: '', SeniorLead: '', Director: '', HeadOfDepartment: 'Sir Jonathan Reed',
      UserStatus: 'Active', TargetUtilization: 5
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: HierarchyPerson) => {
    setEditUser({ ...user });
    setIsModalOpen(true);
  };

  if (loading) return <div className="page-body"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  return (
    <div className="page-body page-flex fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} /> Capacity Hierarchy
          </div>
          <div className="topbar-subtitle">Master record of analyst resources, reporting lines, and target utilization</div>
        </div>
        <div className="topbar-right">
          <span className="record-chip">{filtered.length} Users</span>
          <button className="btn btn-navy btn-sm" onClick={openAddModal}>
            <Plus size={14} /> Add Analyst
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => {
            if (confirm('This will erase your edits and reload the default hierarchy data. Continue?')) {
              localStorage.removeItem('hierarchyData');
              window.location.reload();
            }
          }}>
            Reset Defaults
          </button>
          <button className="btn btn-gold btn-sm" onClick={exportExcel}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="content-area">
        {/* Filters */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input 
                className="filter-input" 
                placeholder="Name, ID, Email..." 
                value={fSearch} 
                onChange={e => { setFSearch(e.target.value); setPage(0); }} 
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Region</label>
              <select className="filter-select" value={fRegion} onChange={e => { setFRegion(e.target.value); setPage(0); }}>
                <option value="">All Regions</option>
                {getUnique(hierarchy, 'NHSRegion').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Team Lead</label>
              <select className="filter-select" value={fLead} onChange={e => { setFLead(e.target.value); setPage(0); }}>
                <option value="">All Leads</option>
                {getUnique(hierarchy, 'TeamLead').map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select className="filter-select" value={fStatus} onChange={e => { setFStatus(e.target.value); setPage(0); }}>
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="btn btn-outline" onClick={() => { setFSearch(''); setFRegion(''); setFLead(''); setFStatus('Active'); setPage(0); }}>Clear Filters</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card table-card">
          <div className="table-wrap">
            <table className="nhs-table">
              <thead>
                <tr>
                  <th colSpan={6} style={{ borderRight: '2px solid #fff', textAlign: 'center', background: '#E8F4FA', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>Analyst Profile & Details</th>
                  <th colSpan={3} style={{ borderRight: '2px solid #fff', textAlign: 'center', background: '#D9EEF8', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>Reporting Structure</th>
                  <th colSpan={3} style={{ textAlign: 'center', background: '#E8F4FA', color: '#0a6399', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '10px 18px', textTransform: 'uppercase' }}>Capacity Management</th>
                </tr>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Job Title</th>
                  <th>Region</th>
                  <th style={{ borderRight: '2px solid var(--border)' }}>Location</th>
                  
                  <th>Team Lead</th>
                  <th>Senior Lead</th>
                  <th style={{ borderRight: '2px solid var(--border)' }}>Director</th>
                  
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Target Util.</th>
                  <th style={{ textAlign: 'center', width: 60 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={12} className="empty-state"><Users size={32}/><p>No users found</p></td></tr>
                ) : rows.map(r => (
                  <tr key={r.UserID}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--navy)' }}>{r.UserID}</td>
                    <td style={{ fontWeight: 600 }}>{r.Name}</td>
                    <td style={{ fontSize: 12, color: 'var(--info)' }}>{r.Email}</td>
                    <td style={{ fontSize: 12 }}>{r.Title}</td>
                    <td style={{ fontSize: 12 }}>{r.NHSRegion}</td>
                    <td style={{ fontSize: 12, borderRight: '2px solid var(--border)' }}>{r.Location}</td>
                    
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{r.TeamLead}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.SeniorLead}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', borderRight: '2px solid var(--border)' }}>{r.Director}</td>
                    
                    <td style={{ textAlign: 'center' }}>
                      <StatusBadge status={r.UserStatus} />
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>
                      {r.TargetUtilization}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'transparent' }} onClick={() => openEditModal(r)}>
                        <Edit2 size={14} color="var(--navy)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span className="pagination-info">Showing {filtered.length === 0 ? 0 : page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}</span>
            <select className="filter-select" style={{ width: 'auto', padding: '4px 8px' }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}>
              {[10, 25, 50].map(n => <option key={n} value={n}>{n} per page</option>)}
            </select>
            <button className="page-btn" onClick={() => setPage(0)} disabled={page === 0}>«</button>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
            <span style={{ fontSize: 13, padding: '0 8px' }}>Page {page + 1} of {totalPages || 1}</span>
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>»</button>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div className="card" style={{ width: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.2s ease-out' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{editUser.HierarchyID ? 'Edit Analyst' : 'Add Analyst'}</div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}><X size={20} color="var(--text-muted)"/></button>
            </div>
            
            <div style={{ padding: 24, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Left Col */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label className="filter-label">User ID (Auto)</label><input className="filter-input" value={editUser.UserID} disabled style={{ background: '#f1f5f9' }}/></div>
                <div><label className="filter-label">Full Name</label><input className="filter-input" value={editUser.Name} onChange={e => setEditUser({...editUser, Name: e.target.value})}/></div>
                <div><label className="filter-label">Email</label><input className="filter-input" value={editUser.Email} onChange={e => setEditUser({...editUser, Email: e.target.value})}/></div>
                <div><label className="filter-label">Job Title</label><input className="filter-input" value={editUser.Title} onChange={e => setEditUser({...editUser, Title: e.target.value})}/></div>
                <div><label className="filter-label">Region</label><input className="filter-input" value={editUser.NHSRegion} onChange={e => setEditUser({...editUser, NHSRegion: e.target.value})}/></div>
                <div><label className="filter-label">Location</label><input className="filter-input" value={editUser.Location} onChange={e => setEditUser({...editUser, Location: e.target.value})}/></div>
              </div>
              
              {/* Right Col */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label className="filter-label">Target Utilization (Max Projects)</label><input type="number" className="filter-input" value={editUser.TargetUtilization} onChange={e => setEditUser({...editUser, TargetUtilization: parseInt(e.target.value) || 0})}/></div>
                <div>
                  <label className="filter-label">Status</label>
                  <select className="filter-select" value={editUser.UserStatus} onChange={e => setEditUser({...editUser, UserStatus: e.target.value as any})}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div><label className="filter-label">Team Lead</label><input className="filter-input" value={editUser.TeamLead} onChange={e => setEditUser({...editUser, TeamLead: e.target.value})}/></div>
                <div><label className="filter-label">Senior Lead</label><input className="filter-input" value={editUser.SeniorLead} onChange={e => setEditUser({...editUser, SeniorLead: e.target.value})}/></div>
                <div><label className="filter-label">Director</label><input className="filter-input" value={editUser.Director} onChange={e => setEditUser({...editUser, Director: e.target.value})}/></div>
              </div>
            </div>
            
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-navy" onClick={handleSaveUser}><Save size={14} /> Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
