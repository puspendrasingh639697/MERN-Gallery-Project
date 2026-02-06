
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiEdit3, FiTrash2, FiImage, FiLoader, FiMenu, FiX, FiLogOut } from 'react-icons/fi';

// API BASE URL - Isko ek hi jagah rakhna best hai
const API_URL = "https://mern-gallery-project.onrender.com/api/images";

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  // Token mangwao localStorage se (Login ke waqt save kiya hoga)
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchAdminImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      setImages(res.data);
    } catch (err) {
      console.error("Images load nahi hui", err);
    }
  };

  useEffect(() => {
    fetchAdminImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !image) return alert("Add both the title and the image!");

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      // Headers mein token bhejna zaroori hai agar backend protected hai
      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Image Uploaded Successfully!");
      setTitle('');
      setImage(null);
      fetchAdminImages();
      setActiveTab('gallery');
    } catch (err) {
      console.error("Upload Fail:", err.response?.data);
      alert(err.response?.data?.message || "Upload failed!");
    } finally {
      setLoading(false);
    }
  };

 const deleteImage = async (imgId) => {
  if (window.confirm("Should I delete it for sure?")) {
    try {
     
      await axios.delete(`${API_URL}/delete/${imgId}`, getAuthHeaders());
      
      alert("Delete ho gayi! ✅");
      fetchAdminImages(); // List refresh karne ke liye
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);
      alert("Delete fail! Shayad backend route galat hai.");
    }
  }
};

  const handleEdit = async (id, currentTitle) => {
    const newTitle = prompt("Enter a new title:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;

    try {
      const res = await axios.put(`${API_URL}/edit/${id}`, { title: newTitle }, getAuthHeaders());
      if (res.status === 200) {
        fetchAdminImages();
      }
    } catch (err) {
      alert("Edit fail ho gaya!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = "/"; // Login page par bhej do
  };

  return (
  <div className="h-screen flex overflow-hidden bg-white">
  {/* Left Sidebar */}
  <aside
    className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col border-r border-gray-800 transform transition-transform duration-300 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0`}
  >
    {/* Sidebar Header */}
    <div className="p-5 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <FiImage size={20} />
        </div>
        <div>
          <h2 className="font-bold text-lg">Admin Gallery</h2>
        </div>
      </div>
    </div>

    {/* Navigation Menu */}
    <nav className="flex-1 p-4">
      <div className="space-y-1">
        <button
          onClick={() => {
            setActiveTab('upload');
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <FiUploadCloud size={18} />
          <span className="font-medium">Upload</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('gallery');
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'gallery'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <FiImage size={18} />
          <span className="font-medium">Gallery</span>
          <span className="ml-auto bg-gray-800 text-xs px-2 py-1 rounded">
            {images.length}
          </span>
        </button>
      </div>
    </nav>

    {/* Logout */}
    <div className="p-4 border-t border-gray-800">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all w-full"
      >
        <FiLogOut size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </aside>

  {/* Overlay for mobile */}
  {sidebarOpen && (
    <div
      onClick={() => setSidebarOpen(false)}
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
    />
  )}

  {/* Right Main Content */}
  <main className="flex-1 flex flex-col overflow-hidden bg-white">
    {/* Top Header */}
    <div className="bg-black text-white p-4 border-b border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={20} />
          </button>
          <h1 className="font-bold text-lg">Gallery Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-gray-400">
            {images.length} Images
          </div>
          <button
            onClick={() => setActiveTab('upload')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FiUploadCloud size={16} />
            Upload New
          </button>
        </div>
      </div>
    </div>

    {/* Content Area */}
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      {activeTab === 'upload' ? (
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiUploadCloud size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Upload New Image</h2>
              <p className="text-gray-500">Add image to your gallery</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Title
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                    id="fileInput"
                    accept="image/*"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer block">
                    <FiImage className="mx-auto text-gray-400 mb-3" size={32} />
                    <p className="text-gray-600 font-medium break-all">
                      {image ? image.name : 'Click to choose image'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !title || !image}
                className={`w-full py-3 font-medium text-white rounded-lg transition-colors ${
                  loading || !title || !image
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  'Upload Image'
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          {/* Gallery Stats */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gallery Images</h2>
            <p className="text-gray-500">Manage your uploaded images</p>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="space-y-4">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0">
                      <img
                        src={img.imageUrl}
                        className="w-full h-full object-cover rounded-lg"
                        alt={img.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                        {img.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(img.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(img._id, img.title)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <FiEdit3 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteImage(img._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiImage size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-3">No Images Found</h3>
              <p className="text-gray-400 mb-8">Your gallery is empty. Upload your first image!</p>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
              >
                <FiUploadCloud />
                Upload First Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </main>
</div>


  );
};

export default UploadForm;