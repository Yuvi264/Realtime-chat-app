import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-base-content/60">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-base-100"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-100" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Information */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm text-base-content/70 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input 
                type="text"
                className="input input-bordered w-full px-4"
                value={authUser?.fullName || ""}
                placeholder="John Doe"
                readOnly
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-base-content/70 flex items-center gap-2">
                <Mail className="w-4 h-4"/>
                Email Address
              </label>
              <input
                type="email"
                className="input input-bordered w-full px-4"
                value={authUser?.email || ""}
                placeholder="john@email.com"
                readOnly
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-base-content/70">Account Information</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-base-content/10">
              <span className="text-sm text-base-content/60">Member Since</span>
              <span className="text-sm">
               {authUser?.updatedAt?.split("T")[0]|| "N/A"}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-base-content/60">Account Status</span>
              <span className="text-sm text-success font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;