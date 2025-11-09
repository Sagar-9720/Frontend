import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { logger } from "../../utils";
import { Form } from "../../components/common/Form";

const log = logger.forSource('ProfilePage');

const ProfilePage: React.FC = () => {
     // Use current user from Auth Context
     const auth = useAuth();
     const user = auth?.user || null;

     const [formData, setFormData] = useState({
       name: "",
       email: "",
       password: "",
       confirmPassword: "",
     });

     const [profileImage, setProfileImage] = useState<string>("/default-avatar.png");

     React.useEffect(() => {
       try {
         if (user) {
           setFormData((prev) => ({
             ...prev,
             name: user.name || "",
             email: user.email || "",
           }));
           setProfileImage(user.profileImg || "/default-avatar.png");
         }
       } catch (error) {
         log.error('Error initializing profile from auth user', error as unknown);
       }
     }, [user]);

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
      log.error('Error handling image upload', error as unknown);
      alert('Failed to upload image');
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
      log.error('Error submitting profile form', error as unknown);
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
              log.error('Error setting fallback profile image', error as unknown);
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
      <Form
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'password', label: 'New Password', type: 'password', componentProps: { placeholder: 'Leave blank to keep current password' } },
          { name: 'confirmPassword', label: 'Confirm Password', type: 'password', componentProps: { placeholder: 'Confirm new password' } }
        ]}
        value={formData}
        onChange={(next) => setFormData(next)}
        onSubmit={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
        submitLabel="Save Changes"
      />
    </div>
  );
 };

export default ProfilePage;
