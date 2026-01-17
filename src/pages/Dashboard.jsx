// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrash, FaDownload, FaEye, 
  FaFilePdf, FaChartLine, FaCalendarAlt, FaCheckCircle,
  FaStar, FaClock, FaSearch, FaFilter, FaSort
} from 'react-icons/fa';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filterStatus, setFilterStatus] = useState('all');
  const [user, setUser] = useState({});

  // Load user and resumes from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    
    // Sort resumes by updatedAt (newest first)
    const sortedResumes = savedResumes.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    setResumes(sortedResumes);
    setLoading(false);
  }, []);

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter(resume => {
      // Search filter
      if (searchTerm && !resume.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filterStatus !== 'all') {
        const isComplete = resume.data?.personal?.name && resume.data?.personal?.email;
        if (filterStatus === 'complete' && !isComplete) return false;
        if (filterStatus === 'incomplete' && isComplete) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'createdAt':
          return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
        case 'updatedAt':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

  const handleCreateNew = () => {
    navigate('/templates');
  };

  const handleEdit = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      const updatedResumes = resumes.filter(r => r.id !== id);
      setResumes(updatedResumes);
      localStorage.setItem('resumes', JSON.stringify(updatedResumes));
      
      // Show success notification
      showNotification('Resume deleted successfully');
    }
  };

  const handleDuplicate = (resume) => {
    const duplicate = {
      ...resume,
      id: 'resume_' + Date.now(),
      title: `${resume.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedResumes = [duplicate, ...resumes];
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    
    showNotification('Resume duplicated successfully');
  };

  const handleDownload = (resume) => {
    // Trigger download
    const link = document.createElement('a');
    const dataStr = JSON.stringify(resume.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `${resume.title || 'resume'}.json`);
    link.click();
    
    showNotification('Resume data downloaded');
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = styles.notification;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  // Calculate statistics
  const stats = {
    total: resumes.length,
    completed: resumes.filter(r => r.data?.personal?.name && r.data?.personal?.email).length,
    incomplete: resumes.filter(r => !(r.data?.personal?.name && r.data?.personal?.email)).length,
    lastCreated: resumes.length > 0 ? new Date(resumes[0].createdAt || resumes[0].updatedAt).toLocaleDateString() : 'Never',
    todayCount: resumes.filter(r => {
      const today = new Date().toDateString();
      const resumeDate = new Date(r.updatedAt).toDateString();
      return today === resumeDate;
    }).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Manage and track your resumes</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.newBtn} onClick={handleCreateNew}>
            <FaPlus /> Create New Resume
          </button>
          <Link to="/templates" className={styles.templatesBtn}>
            <FaStar /> Browse Templates
          </Link>
        </div>
      </div>

      {/* User Stats Card */}
      <div className={styles.userStatsCard}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className={styles.userDetails}>
            <h3>{user.name || 'Welcome!'}</h3>
            <p>{user.email || 'Start creating your professional resume'}</p>
          </div>
        </div>
        <div className={styles.planBadge}>
          {(typeof user.subscription === 'object' 
    ? user.subscription.plan 
    : user.subscription || 'free'
  ).toUpperCase()} PLAN
          {user.subscription === 'free' && (
            <Link to="/upgrade" className={styles.upgradeLink}>
              Upgrade →
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.primary}`}>
          <div className={styles.statIcon}>
            <FaFilePdf />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Resumes</div>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statIcon}>
            <FaCheckCircle />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          {completionRate > 0 && (
            <div className={styles.statProgress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{completionRate}% complete</span>
            </div>
          )}
        </div>
        
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statIcon}>
            <FaClock />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.incomplete}</div>
            <div className={styles.statLabel}>In Progress</div>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statIcon}>
            <FaCalendarAlt />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.todayCount}</div>
            <div className={styles.statLabel}>Today's Activity</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <FaFilter className={styles.filterIcon} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Resumes</option>
              <option value="complete">Completed</option>
              <option value="incomplete">In Progress</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <FaSort className={styles.filterIcon} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resume List */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>My Resumes ({filteredResumes.length})</h2>
          <div className={styles.listActions}>
            <button 
              className={styles.actionBtn}
              onClick={() => {
                const allData = JSON.stringify(resumes, null, 2);
                const blob = new Blob([allData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'all_resumes_backup.json';
                link.click();
                URL.revokeObjectURL(url);
                showNotification('All resumes backed up');
              }}
            >
              <FaDownload /> Backup All
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading your resumes...</p>
          </div>
        ) : filteredResumes.length > 0 ? (
          <div className={styles.resumeGrid}>
            {filteredResumes.map((resume) => {
              const isComplete = resume.data?.personal?.name && resume.data?.personal?.email;
              const updatedDate = new Date(resume.updatedAt);
              const isRecent = (Date.now() - updatedDate) < 24 * 60 * 60 * 1000; // Last 24 hours
              
              return (
                <div key={resume.id} className={`${styles.resumeCard} ${isRecent ? styles.recent : ''}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.resumeStatus}>
                      <span className={`${styles.statusBadge} ${isComplete ? styles.complete : styles.incomplete}`}>
                        {isComplete ? '✓ Complete' : '⏳ In Progress'}
                      </span>
                      {isRecent && <span className={styles.newBadge}>NEW</span>}
                    </div>
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.iconBtn}
                        onClick={() => handleEdit(resume.id)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={styles.iconBtn}
                        onClick={() => handleDuplicate(resume)}
                        title="Duplicate"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={styles.iconBtn}
                        onClick={() => handleDownload(resume)}
                        title="Download"
                      >
                        <FaDownload />
                      </button>
                      <button 
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(resume.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <h3 className={styles.resumeTitle}>
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className={styles.resumePreview}>
                      {resume.data?.personal?.summary?.substring(0, 100) || 
                       'No summary available...'}
                    </p>
                    
                    <div className={styles.resumeMeta}>
                      <div className={styles.metaItem}>
                        <FaCalendarAlt />
                        <span>Updated: {updatedDate.toLocaleDateString()}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <FaChartLine />
                        <span>Template: {resume.template || 'Default'}</span>
                      </div>
                    </div>
                    
                    <div className={styles.skillsPreview}>
                      {resume.data?.skills?.slice(0, 3).map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                      {resume.data?.skills?.length > 3 && (
                        <span className={styles.moreSkills}>
                          +{resume.data.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.primaryAction}
                      onClick={() => handleEdit(resume.id)}
                    >
                      <FaEdit /> Continue Editing
                    </button>
                    <button 
                      className={styles.secondaryAction}
                      onClick={() => {
                        // Preview functionality
                        const previewWindow = window.open('', '_blank');
                        previewWindow.document.write(`
                          <html>
                            <head><title>Preview: ${resume.title}</title></head>
                            <body>
                              <h1>${resume.title}</h1>
                              <p>This is a preview of your resume</p>
                            </body>
                          </html>
                        `);
                      }}
                    >
                      <FaEye /> Preview
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📄</div>
            <h3>No resumes found</h3>
            <p>{searchTerm || filterStatus !== 'all' ? 
              'Try adjusting your search or filter criteria' : 
              'Create your first professional resume to get started'}
            </p>
            <div className={styles.emptyActions}>
              <button className={styles.ctaBtn} onClick={handleCreateNew}>
                <FaPlus /> Create New Resume
              </button>
              {(searchTerm || filterStatus !== 'all') && (
                <button 
                  className={styles.clearBtn}
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className={styles.tipsSection}>
        <h3>💡 Quick Tips</h3>
        <div className={styles.tipsGrid}>
          <div className={styles.tipCard}>
            <h4>Complete Your Profile</h4>
            <p>Add personal details to make your resume stand out</p>
          </div>
          <div className={styles.tipCard}>
            <h4>Use Multiple Templates</h4>
            <p>Try different designs for different job applications</p>
          </div>
          <div className={styles.tipCard}>
            <h4>Export Regularly</h4>
            <p>Download your resumes to keep local backups</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;