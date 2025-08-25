import React, { useState } from "react";
import { Button } from "../../components/common/Button";
import { useUserData } from "../../DataManagers/userDataManager";

const ProfilePage: React.FC = () => {
  try {
    // Safe hook usage with error handling
    const userData = useUserData();
    const users = userData && typeof userData === 'object' && 'users' in userData ? (userData as any).users : [];
    const loggedInUser = Array.isArray(users) && users.length > 0 ? users[0] : null;

    const [formData, setFormData] = useState({
      name: loggedInUser?.name || "",
      email: loggedInUser?.email || "",
      password: "",
      confirmPassword: "",
    });

    const [profileImage, setProfileImage] = useState<string>(
      loggedInUser?.profileImage || "/default-avatar.png"
    );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e?.target?.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          return;
        }

        const fileReader = new FileReader();
        fileReader.onload = (upload) => {
          try {
            if (upload?.target?.result) {
              setProfileImage(upload.target.result as string);
            }
          } catch (error) {
            console.error('Error setting profile image:', error);
            alert('Failed to load image');
          }
        };
        
        fileReader.onerror = () => {
          console.error('FileReader error');
          alert('Failed to read image file');
        };
        
        fileReader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Failed to upload image');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e?.target?.name && e?.target?.value !== undefined) {
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      }
    } catch (error) {
      console.error('Error updating form data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      // Validate form data
      if (!formData.name.trim()) {
        alert('Name is required');
        return;
      }
      
      if (!formData.email.trim()) {
        alert('Email is required');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      // Validate password confirmation if password is provided
      if (formData.password && formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      // TODO: Call update profile API
      console.log("Updated profile:", formData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error submitting profile form:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      {/* Profile Image */}
      <div className="flex flex-col items-center space-y-3">
        <img
          src={profileImage || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
          onError={(e) => {
            try {
              (e.target as HTMLImageElement).src = "/default-avatar.png";
            } catch (error) {
              console.error('Error setting fallback profile image:', error);
            }
          }}
        />
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <span className="text-blue-600 hover:underline">
            Change Profile Picture
          </span>
        </label>
      </div>

      {/* Profile Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="border rounded w-full px-3 py-2"
            value={formData?.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="border rounded w-full px-3 py-2"
            value={formData?.email || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            name="password"
            className="border rounded w-full px-3 py-2"
            value={formData?.password || ""}
            onChange={handleInputChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div>
          <label className="block font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="border rounded w-full px-3 py-2"
            value={formData?.confirmPassword || ""}
            onChange={handleInputChange}
            placeholder="Confirm new password"
          />
        </div>

        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </form>
    </div>
  );
  } catch (error) {
    console.error('Error rendering Profile page:', error);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
        <h1 className="text-2xl font-bold text-red-600">Profile Error</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load profile page</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
};

export default ProfilePage;
