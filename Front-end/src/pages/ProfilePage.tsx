import React from "react";

const ProfilePage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-center">Your Profile</h1>

      {/* Profile card */}
      <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-6">
          {/* Profile avatar placeholder */}
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold">
            SP
          </div>

          {/* Basic info */}
          <div>
            <h2 className="text-2xl font-semibold">User One</h2>
            <p className="text-gray-600">user@example.com</p>
            <p className="text-gray-500 text-sm">Joined: January 2024</p>
          </div>
        </div>
      </section>

      {/* Account details */}
      <section className="bg-gray-100 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">Account Details</h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Username:</span> user123
          </p>
          <p>
            <span className="font-medium">Industry Preference:</span> Technology
          </p>
          <p>
            <span className="font-medium">Location:</span> Melbourne, Australia
          </p>
        </div>
      </section>

      {/* Actions */}
      <section className="flex space-x-4">
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 font-medium">
          Edit Profile
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 font-medium">
          Settings
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 font-medium">
          Logout
        </button>
      </section>
    </main>
  );
};

export default ProfilePage;
