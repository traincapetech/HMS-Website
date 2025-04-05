// Admin middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
    // req.user is set by the authenticateToken middleware
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};

// Super admin middleware to check if user is a super admin
export const isSuperAdmin = (req, res, next) => {
    // req.user is set by the authenticateToken middleware
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    // Check if user has superadmin role
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Super admin access required'
        });
    }

    next();
};

// Check if user has permission to manage doctors
export const canManageDoctors = (req, res, next) => {
    if (!req.user || !req.user.permissions || !req.user.permissions.manageDoctors) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to manage doctors'
        });
    }
    next();
};

// Check if user has permission to manage patients
export const canManagePatients = (req, res, next) => {
    if (!req.user || !req.user.permissions || !req.user.permissions.managePatients) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to manage patients'
        });
    }
    next();
};

// Check if user has permission to manage pricing
export const canManagePricing = (req, res, next) => {
    if (!req.user || !req.user.permissions || !req.user.permissions.managePricing) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to manage pricing'
        });
    }
    next();
}; 