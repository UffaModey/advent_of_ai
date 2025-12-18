// Backup coverage functionality
function initializeBackupCoverage() {
    renderBackupCoverage();
}

function renderBackupCoverage() {
    const container = document.getElementById('backup-coverage');
    container.innerHTML = '';
    
    // Create backup coverage overview
    const overviewSection = createBackupOverview();
    container.appendChild(overviewSection);
    
    // Create detailed backup assignments
    Object.entries(backupAssignments).forEach(([role, assignment]) => {
        const backupSection = createBackupSection(role, assignment);
        container.appendChild(backupSection);
    });
    
    // Add coverage gap analysis
    const gapAnalysis = createCoverageGapAnalysis();
    container.appendChild(gapAnalysis);
}

function createBackupOverview() {
    const section = document.createElement('div');
    section.className = 'backup-overview mb-4';
    
    // Calculate coverage statistics
    const totalRoles = Object.keys(backupAssignments).length;
    const rolesWithBackup = Object.values(backupAssignments).filter(a => a.backups.length > 0).length;
    const criticalRoles = Object.values(backupAssignments).filter(a => a.notes && a.notes.includes('CRITICAL')).length;
    
    section.innerHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                    <i class="fas fa-shield-alt me-2"></i>Backup Coverage Overview
                </h5>
            </div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-number">${totalRoles}</div>
                            <div class="stat-label">Total Roles</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-number">${rolesWithBackup}</div>
                            <div class="stat-label">Roles w/ Backup</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-number">${criticalRoles}</div>
                            <div class="stat-label">Critical Gaps</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item">
                            <div class="stat-number">${Math.round((rolesWithBackup/totalRoles)*100)}%</div>
                            <div class="stat-label">Coverage Rate</div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6>Quick Actions</h6>
                        <button class="btn btn-outline-primary btn-sm" onclick="generateBackupReport()">
                            <i class="fas fa-file-alt me-1"></i>Generate Report
                        </button>
                    </div>
                    <div class="btn-group w-100" role="group">
                        <button class="btn btn-outline-warning" onclick="highlightCriticalGaps()">
                            <i class="fas fa-exclamation-triangle me-1"></i>Critical Gaps
                        </button>
                        <button class="btn btn-outline-info" onclick="showCoverageMatrix()">
                            <i class="fas fa-table me-1"></i>Coverage Matrix
                        </button>
                        <button class="btn btn-outline-success" onclick="optimizeBackups()">
                            <i class="fas fa-cogs me-1"></i>Optimize
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return section;
}

function createBackupSection(role, assignment) {
    const section = document.createElement('div');
    section.className = 'backup-section mb-3';
    
    const primaryStaff = getStaffById(assignment.primary.toLowerCase().replace(' ', ''));
    const primaryColor = primaryStaff ? primaryStaff.color : '#6c757d';
    
    // Determine status class
    let statusClass = 'success';
    let statusIcon = 'check-circle';
    
    if (assignment.backups.length === 0) {
        statusClass = 'danger';
        statusIcon = 'exclamation-triangle';
    } else if (assignment.notes && assignment.notes.includes('CRITICAL')) {
        statusClass = 'warning';
        statusIcon = 'exclamation-circle';
    }
    
    section.innerHTML = `
        <div class="card">
            <div class="backup-role-header d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, ${primaryColor}, #6c757d);">
                <div>
                    <strong>${role}</strong>
                    <small class="d-block opacity-75">Primary: ${assignment.primary}</small>
                </div>
                <div>
                    <i class="fas fa-${statusIcon} text-${statusClass === 'success' ? 'light' : 'warning'}"></i>
                </div>
            </div>
            <div class="backup-assignments">
                ${assignment.backups.length > 0 ? `
                    <div class="mb-3">
                        <h6 class="text-primary">Backup Staff</h6>
                        ${assignment.backups.map(backupName => {
                            const backupStaff = staffData.find(s => s.name === backupName);
                            const coverage = assignment.coverage[backupName] || 'Available as backup';
                            
                            return `
                                <div class="backup-item">
                                    <div class="d-flex align-items-center">
                                        ${backupStaff ? `
                                            <div class="backup-avatar me-2" style="background-color: ${backupStaff.color};">
                                                ${backupStaff.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        ` : ''}
                                        <div class="flex-grow-1">
                                            <div class="backup-primary">${backupName}</div>
                                            <div class="backup-secondary">${coverage}</div>
                                        </div>
                                        <div>
                                            <button class="btn btn-outline-primary btn-sm" onclick="viewBackupDetails('${backupName}', '${role}')">
                                                <i class="fas fa-info-circle"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>No backup coverage available for this role!</strong>
                    </div>
                `}
                
                ${assignment.notes ? `
                    <div class="alert alert-${assignment.notes.includes('CRITICAL') ? 'danger' : 'info'}">
                        <i class="fas fa-info-circle me-2"></i>
                        ${assignment.notes}
                    </div>
                ` : ''}
                
                <div class="backup-actions">
                    <button class="btn btn-outline-secondary btn-sm me-2" onclick="addBackupStaff('${role}')">
                        <i class="fas fa-plus me-1"></i>Add Backup
                    </button>
                    <button class="btn btn-outline-info btn-sm" onclick="analyzeRoleCoverage('${role}')">
                        <i class="fas fa-chart-line me-1"></i>Analyze Coverage
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return section;
}

function createCoverageGapAnalysis() {
    const section = document.createElement('div');
    section.className = 'coverage-gap-analysis mt-4';
    
    // Analyze coverage gaps
    const gaps = analyzeCoverageGaps();
    
    section.innerHTML = `
        <div class="card">
            <div class="card-header bg-warning text-dark">
                <h5 class="mb-0">
                    <i class="fas fa-analytics me-2"></i>Coverage Gap Analysis
                </h5>
            </div>
            <div class="card-body">
                ${gaps.length > 0 ? `
                    <div class="alert alert-warning">
                        <h6>⚠️ Coverage Issues Identified</h6>
                        <ul class="mb-0">
                            ${gaps.map(gap => `<li>${gap}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="mt-3">
                        <h6>Recommendations</h6>
                        ${generateRecommendations(gaps)}
                    </div>
                ` : `
                    <div class="alert alert-success">
                        <h6>✅ Good Coverage</h6>
                        <p class="mb-0">All roles have adequate backup coverage with minimal gaps.</p>
                    </div>
                `}
            </div>
        </div>
    `;
    
    return section;
}

function analyzeCoverageGaps() {
    const gaps = [];
    
    Object.entries(backupAssignments).forEach(([role, assignment]) => {
        if (assignment.backups.length === 0) {
            gaps.push(`${role}: No backup staff assigned`);
        }
        
        if (assignment.notes && assignment.notes.includes('CRITICAL')) {
            gaps.push(`${role}: Critical dependency - ${assignment.notes}`);
        }
        
        // Check for scheduling conflicts
        const primary = staffData.find(s => s.name === assignment.primary);
        if (primary) {
            const primaryDays = primary.schedule.map(s => s.day);
            assignment.backups.forEach(backupName => {
                const backup = staffData.find(s => s.name === backupName);
                if (backup) {
                    const backupDays = backup.schedule.map(s => s.day);
                    const overlap = primaryDays.filter(day => backupDays.includes(day));
                    
                    if (overlap.length === 0) {
                        gaps.push(`${role}: ${backupName} has no schedule overlap with primary`);
                    }
                }
            });
        }
    });
    
    return gaps;
}

function generateRecommendations(gaps) {
    const recommendations = [];
    
    if (gaps.some(gap => gap.includes('First Aid'))) {
        recommendations.push('🏥 Arrange external medical support or train additional staff in first aid');
    }
    
    if (gaps.some(gap => gap.includes('Photo Booth'))) {
        recommendations.push('📸 Schedule training session for David to teach photo booth operation to backup staff');
    }
    
    if (gaps.some(gap => gap.includes('no schedule overlap'))) {
        recommendations.push('📅 Review staff schedules to ensure backup coverage during primary staff working hours');
    }
    
    if (gaps.some(gap => gap.includes('No backup staff'))) {
        recommendations.push('👥 Recruit additional volunteers or cross-train existing staff for uncovered roles');
    }
    
    recommendations.push('📋 Regular backup coverage drills to ensure readiness');
    recommendations.push('📞 Establish emergency contact tree for quick backup activation');
    
    return `
        <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    `;
}

function viewBackupDetails(backupName, role) {
    const backup = staffData.find(s => s.name === backupName);
    if (!backup) return;
    
    const assignment = backupAssignments[role];
    const coverage = assignment.coverage[backupName] || 'Available as backup';
    
    const content = `
        <div class="backup-details">
            <h5>${backupName} - Backup for ${role}</h5>
            
            <div class="row">
                <div class="col-md-6">
                    <h6>Staff Information</h6>
                    <p><strong>Role:</strong> ${backup.role}</p>
                    <p><strong>Skills:</strong> ${backup.skills.join(', ')}</p>
                    <p><strong>Availability:</strong> ${backup.availability}</p>
                    ${backup.preferences ? `<p><strong>Preferences:</strong> ${backup.preferences}</p>` : ''}
                </div>
                <div class="col-md-6">
                    <h6>Backup Coverage</h6>
                    <p>${coverage}</p>
                    
                    <h6>Contact</h6>
                    <p><i class="fas fa-phone me-2"></i>${backup.contact.phone}</p>
                    <p><i class="fas fa-envelope me-2"></i>${backup.contact.email}</p>
                </div>
            </div>
            
            <div class="mt-3">
                <h6>Schedule Overlap Analysis</h6>
                ${generateOverlapAnalysis(backup, assignment.primary)}
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    document.getElementById('print-content').innerHTML = content;
    document.querySelector('#printModal .modal-title').textContent = 'Backup Staff Details';
    modal.show();
}

function generateOverlapAnalysis(backup, primaryName) {
    const primary = staffData.find(s => s.name === primaryName);
    if (!primary) return '<p>Primary staff not found</p>';
    
    const primaryDays = primary.schedule.map(s => s.day);
    const backupDays = backup.schedule.map(s => s.day);
    const overlap = primaryDays.filter(day => backupDays.includes(day));
    
    if (overlap.length === 0) {
        return '<div class="alert alert-warning">No schedule overlap - backup cannot cover during primary working hours</div>';
    }
    
    return `
        <div class="alert alert-success">
            <strong>Schedule overlap on:</strong> ${overlap.map(day => 
                day.charAt(0).toUpperCase() + day.slice(1)
            ).join(', ')}
        </div>
        <div class="overlap-details">
            ${overlap.map(day => {
                const primaryShift = primary.schedule.find(s => s.day === day);
                const backupShift = backup.schedule.find(s => s.day === day);
                
                return `
                    <div class="mb-2">
                        <strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong><br>
                        <small>Primary: ${formatTime(primaryShift.start)} - ${formatTime(primaryShift.end)}</small><br>
                        <small>Backup: ${formatTime(backupShift.start)} - ${formatTime(backupShift.end)}</small>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateBackupReport() {
    const reportContent = `
        <div class="backup-report">
            <div class="text-center mb-4">
                <h2>Backup Coverage Report</h2>
                <p>Festival Staff Management System</p>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${createBackupOverview().outerHTML}
            
            <div class="detailed-assignments">
                <h3>Detailed Backup Assignments</h3>
                ${Object.entries(backupAssignments).map(([role, assignment]) => `
                    <div class="role-section mb-4">
                        <h4>${role}</h4>
                        <p><strong>Primary:</strong> ${assignment.primary}</p>
                        <p><strong>Backups:</strong> ${assignment.backups.length > 0 ? assignment.backups.join(', ') : 'None'}</p>
                        ${assignment.notes ? `<p><strong>Notes:</strong> ${assignment.notes}</p>` : ''}
                        
                        <div class="coverage-details">
                            ${Object.entries(assignment.coverage).map(([name, coverage]) => `
                                <p><strong>${name}:</strong> ${coverage}</p>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="gap-analysis">
                <h3>Coverage Gaps & Recommendations</h3>
                ${analyzeCoverageGaps().length > 0 ? `
                    <ul>
                        ${analyzeCoverageGaps().map(gap => `<li>${gap}</li>`).join('')}
                    </ul>
                    ${generateRecommendations(analyzeCoverageGaps())}
                ` : '<p>No significant coverage gaps identified.</p>'}
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    document.getElementById('print-content').innerHTML = reportContent;
    document.querySelector('#printModal .modal-title').textContent = 'Backup Coverage Report';
    modal.show();
}