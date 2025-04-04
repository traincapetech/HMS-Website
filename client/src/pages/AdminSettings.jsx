import React, { useState, useRef } from 'react';
import { FaUser, FaLock, FaImage, FaPlus, FaTrash, FaEdit, FaEye, FaEyeSlash, FaEnvelope, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    
    // Profile Information State
    const [adminProfile, setAdminProfile] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        profilePhoto: null
    });
    const [editName, setEditName] = useState(false);
    const [tempName, setTempName] = useState(adminProfile.name);

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile Photo State
    const [profilePhotoPreview, setProfilePhotoPreview] = useState('https://via.placeholder.com/150');
    const fileInputRef = useRef(null);

    // Email Change State
    const [newEmail, setNewEmail] = useState('');
    const [currentEmailPassword, setCurrentEmailPassword] = useState('');
    const [showEmailPassword, setShowEmailPassword] = useState(false);

    // Subadmin Management Code
    const [subadmins, setSubadmins] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', permissions: ['doctors', 'patients'] },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', permissions: ['pricing'] }
    ]);
    const [showSubadminForm, setShowSubadminForm] = useState(false);
    const [newSubadmin, setNewSubadmin] = useState({
        name: '',
        email: '',
        password: '',
        showPassword: false,
        permissions: []
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result);
                setAdminProfile(prev => ({
                    ...prev,
                    profilePhoto: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdatePhoto = () => {
        if (!adminProfile.profilePhoto) {
            toast.error("Please select a photo first");
            return;
        }
        // Here you would typically make an API call to update the profile photo
        toast.success("Profile photo updated successfully");
    };

    const handleNameUpdate = () => {
        if (!tempName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        setAdminProfile(prev => ({
            ...prev,
            name: tempName
        }));
        setEditName(false);
        toast.success("Name updated successfully");
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        // Add your password change logic here (typically would involve API call)
        toast.success("Password changed successfully");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleEmailChange = (e) => {
        e.preventDefault();
        // Validate current password for email change
        if (!currentEmailPassword) {
            toast.error("Please enter your current password");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Here you would typically make an API call to verify the password and change the email
        setAdminProfile(prev => ({
            ...prev,
            email: newEmail
        }));
        
        toast.success("Email updated successfully");
        setNewEmail('');
        setCurrentEmailPassword('');
    };

    // Subadmin Management Functions
    const permissionOptions = [
        { value: 'doctors', label: 'Manage Doctors' },
        { value: 'patients', label: 'Manage Patients' },
        { value: 'pricing', label: 'Manage Pricing' },
        { value: 'analytics', label: 'View Analytics' },
        { value: 'settings', label: 'Manage Settings' }
    ];

    const handlePermissionToggle = (permission) => {
        setNewSubadmin(prev => {
            if (prev.permissions.includes(permission)) {
                return {
                    ...prev,
                    permissions: prev.permissions.filter(p => p !== permission)
                };
            } else {
                return {
                    ...prev,
                    permissions: [...prev.permissions, permission]
                };
            }
        });
    };

    const handleAddSubadmin = (e) => {
        e.preventDefault();
        if (!newSubadmin.name || !newSubadmin.email || !newSubadmin.password) {
            toast.error("Please fill all fields");
            return;
        }
        
        const newId = subadmins.length > 0 ? Math.max(...subadmins.map(s => s.id)) + 1 : 1;
        setSubadmins([...subadmins, { 
            ...newSubadmin, 
            id: newId,
            showPassword: undefined
        }]);
        setNewSubadmin({
            name: '',
            email: '',
            password: '',
            showPassword: false,
            permissions: []
        });
        setShowSubadminForm(false);
        toast.success("Subadmin added successfully");
    };

    const handleDeleteSubadmin = (id) => {
        if (window.confirm("Are you sure you want to delete this subadmin?")) {
            setSubadmins(subadmins.filter(subadmin => subadmin.id !== id));
            toast.success("Subadmin deleted successfully");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile Settings
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'subadmins' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('subadmins')}
                >
                    Subadmins
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Photo Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaUser className="mr-2" /> Profile Photo
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <img
                                    src={profilePhotoPreview}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                                >
                                    <FaImage />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <button
                                onClick={handleUpdatePhoto}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                                disabled={!adminProfile.profilePhoto}
                            >
                                <FaSave className="mr-2" /> Update Photo
                            </button>
                        </div>
                    </div>

                    {/* Name Change Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaUser className="mr-2" /> Profile Information
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Name</label>
                            {editName ? (
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded mr-2"
                                    />
                                    <button
                                        onClick={handleNameUpdate}
                                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditName(false);
                                            setTempName(adminProfile.name);
                                        }}
                                        className="ml-2 px-3 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800">{adminProfile.name}</span>
                                    <button
                                        onClick={() => setEditName(true)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Change Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaEnvelope className="mr-2" /> Change Email
                        </h2>
                        <form onSubmit={handleEmailChange}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Current Email</label>
                                <input
                                    type="email"
                                    value={adminProfile.email}
                                    disabled
                                    className="w-full px-3 py-2 border rounded bg-gray-100"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">New Email</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showEmailPassword ? "text" : "password"}
                                        value={currentEmailPassword}
                                        onChange={(e) => setCurrentEmailPassword(e.target.value)}
                                        className="w-full px-3 py-2 border rounded pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                                    >
                                        {showEmailPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Email
                            </button>
                        </form>
                    </div>

                    {/* Password Change Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaLock className="mr-2" /> Change Password
                        </h2>
                        <form onSubmit={handleChangePassword}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-3 py-2 border rounded pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 border rounded pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border rounded pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'subadmins' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Subadmin Management</h2>
                        <button
                            onClick={() => setShowSubadminForm(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                        >
                            <FaPlus className="mr-2" /> Add Subadmin
                        </button>
                    </div>

                    {showSubadminForm && (
                        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Add New Subadmin</h3>
                            <form onSubmit={handleAddSubadmin}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={newSubadmin.name}
                                            onChange={(e) => setNewSubadmin({...newSubadmin, name: e.target.value})}
                                            className="w-full px-3 py-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={newSubadmin.email}
                                            onChange={(e) => setNewSubadmin({...newSubadmin, email: e.target.value})}
                                            className="w-full px-3 py-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                type={newSubadmin.showPassword ? "text" : "password"}
                                                value={newSubadmin.password}
                                                onChange={(e) => setNewSubadmin({...newSubadmin, password: e.target.value})}
                                                className="w-full px-3 py-2 border rounded pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                                onClick={() => setNewSubadmin({...newSubadmin, showPassword: !newSubadmin.showPassword})}
                                            >
                                                {newSubadmin.showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Permissions</label>
                                    <div className="flex flex-wrap gap-2">
                                        {permissionOptions.map(option => (
                                            <label key={option.value} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={newSubadmin.permissions.includes(option.value)}
                                                    onChange={() => handlePermissionToggle(option.value)}
                                                    className="rounded"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubadminForm(false)}
                                        className="px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Add Subadmin
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subadmins.length > 0 ? (
                                    subadmins.map(subadmin => (
                                        <tr key={subadmin.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <FaUser className="text-gray-500" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{subadmin.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {subadmin.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {subadmin.permissions.map(permission => {
                                                        const perm = permissionOptions.find(p => p.value === permission);
                                                        return perm ? (
                                                            <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                                {perm.label}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteSubadmin(subadmin.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No subadmins found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;