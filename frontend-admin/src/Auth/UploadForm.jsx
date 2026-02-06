// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FiUploadCloud, FiEdit3, FiTrash2, FiImage, FiLoader, FiMenu, FiX, FiLogOut } from 'react-icons/fi';

// const UploadForm = () => {
//   const [title, setTitle] = useState('');
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [images, setImages] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('upload');

//   const fetchAdminImages = async () => {
//     try {
//       const res = await axios.get('https://mern-gallery-project.onrender.com/api/images/all');
//       setImages(res.data);
//     } catch (err) {
//       console.error("Images load nahi hui", err);
//     }
//   };

//   useEffect(() => {
//     fetchAdminImages();
//   }, []);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!title || !image) return alert("Add both the title and the image.!");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('image', image);

//     try {
//       await axios.post('https://mern-gallery-project.onrender.com/api/images/upload', formData);
//       alert("Image Uploaded Successfully!");
//       setTitle('');
//       setImage(null);
//       fetchAdminImages();
//       setActiveTab('gallery');
//       setSidebarOpen(false);
//     } catch (err) {
//       console.error("Upload Fail:", err.response?.data);
//       alert("Upload failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteImage = async (imgId) => {
//     if (window.confirm("Should I delete it for sure?")) {
//       try {
//         await axios.delete(`https://mern-gallery-project.onrender.com/api/images/${imgId}`);
//         fetchAdminImages();
//       } catch (err) {
//         alert("Delete fail!");
//       }
//     }
//   };

//   const handleEdit = async (id, currentTitle) => {
//     const newTitle = prompt("Enter a new title:", currentTitle);
//     if (!newTitle || newTitle === currentTitle) return;

//     try {
//       const res = await axios.put(`https://mern-gallery-project.onrender.com/api/images/edit/${id}`, {
//         title: newTitle
//       });
//       if (res.status === 200) {
//         fetchAdminImages();
//       }
//     } catch (err) {
//       alert("Edit fail ho gaya!");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen flex bg-white">


//       <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
//         <div className="flex items-center justify-between p-5 border-b">
//           <h2 className="text-xl font-bold text-blue-700">Admin Panel</h2>
//           <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
//             <FiX size={22} />
//           </button>
//         </div>

//         <nav className="p-5 space-y-3 flex flex-col h-[calc(100%-80px)]">
//           <div className="space-y-3 flex-1">
//             <button
//               onClick={() => {
//                 setActiveTab('upload');
//                 setSidebarOpen(false);
//               }}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'upload' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
//                 }`}
//             >
//               <FiUploadCloud /> Upload
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab('gallery');
//                 setSidebarOpen(false);
//               }}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'gallery' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
//                 }`}
//             >
//               <FiImage /> Gallery
//             </button>
//           </div>

//           {/* Logout in Sidebar */}

//         </nav>
//       </aside>

//       {/* Mobile menu button */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded-xl shadow"
//         onClick={() => setSidebarOpen(true)}
//       >
//         <FiMenu size={22} />
//       </button>


//       <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto bg-white">

//         {/* Upload Section */}
//         {activeTab === 'upload' && (
//           <div className="w-full max-w-3xl mx-auto">
//             <form onSubmit={handleUpload} className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow border border-slate-100">
//               <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2 border-b pb-3">
//                 <FiUploadCloud className="text-blue-500" /> Upload Image
//               </h2>
//               <div className="flex flex-col gap-5">
//                 <div>
//                   <label className="text-sm font-semibold text-slate-600 mb-1 block">Image Title</label>
//                   <input
//                     type="text"
//                     placeholder="Title Name"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full border border-slate-200 p-3 sm:p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-semibold text-slate-600 mb-1 block">Select File</label>
//                   <input
//                     type="file"
//                     onChange={(e) => setImage(e.target.files[0])}
//                     className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 sm:file:py-3 file:px-4 sm:file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`font-bold py-3 sm:py-4 text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg rounded-xl ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600 shadow-blue-200'}`}
//                 >
//                   {loading ? <FiLoader className="animate-spin text-xl" /> : <><FiUploadCloud size={20} /> Upload</>}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Gallery Section */}
//         {activeTab === 'gallery' && (
//           <div className="w-full max-w-5xl mx-auto">
//             <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow border border-slate-100 min-h-[500px]">
//               <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-slate-800 flex items-center gap-2">
//                 <FiImage className="text-blue-500" /> Gallery ({images.length})
//               </h2>

//               <div className="flex flex-col gap-4 sm:gap-5">
//                 {images.length > 0 ? (
//                   images.map((img) => (
//                     <div key={img._id} className="group flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 sm:p-5 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300 gap-4">
//                       <div className="flex items-center flex-col sm:flex-row gap-4 sm:gap-5 w-full">
//                         <div className="relative overflow-hidden rounded-xl w-full sm:w-28 h-40 sm:h-24 shadow-sm">
//                           <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={img.title} />
//                         </div>
//                         <div className="text-center sm:text-left">
//                           <p className="font-bold text-base sm:text-lg text-slate-800 capitalize leading-tight">{img.title}</p>
//                           <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
//                             {new Date(img.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                         <button
//                           onClick={() => handleEdit(img._id, img.title)}
//                           className="w-full sm:w-auto bg-blue-600 text-white border border-blue-800 px-5 py-3  font-bold hover:bg-blue-700 active:scale-90 transition-all flex items-center justify-center gap-2"
//                         >
//                           <FiEdit3 size={18} /> Edit
//                         </button>
//                         <button
//                           onClick={() => deleteImage(img._id)}
//                           className="w-full sm:w-auto bg-blue-600 text-white border border-blue-800 px-5 py-3  font-bold hover:bg-blue-700 active:scale-90 transition-all flex items-center justify-center gap-2"
//                         >
//                           <FiTrash2 size={18} /> Delete
//                         </button>
//                       </div>

//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-slate-300">
//                     <FiImage size={60} className="mb-4 opacity-20" />
//                     <p className="text-base sm:text-lg font-medium">Your gallery is empty</p>
//                     <p className="text-sm">Start by uploading your first masterpiece!</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// };

// export default UploadForm;


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
        await axios.delete(`${API_URL}/${imgId}`, getAuthHeaders());
        fetchAdminImages();
      } catch (err) {
        alert("Delete fail!");
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-blue-700 tracking-tight">Admin Gallery</h2>
          <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        <nav className="p-4 flex flex-col h-[calc(100%-85px)] justify-between">
          <div className="space-y-2">
            <button
              onClick={() => { setActiveTab('upload'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'upload' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FiUploadCloud size={18} /> Upload New
            </button>
            <button
              onClick={() => { setActiveTab('gallery'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'gallery' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FiImage size={18} /> My Gallery
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 transition-all mt-auto"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <button className="md:hidden mb-6 bg-white p-2 rounded-lg shadow-sm border" onClick={() => setSidebarOpen(true)}>
          <FiMenu size={22} />
        </button>

        {activeTab === 'upload' ? (
          <div className="max-w-2xl mx-auto mt-10">
            <form onSubmit={handleUpload} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Upload Masterpiece</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block uppercase tracking-wider">Project Title</label>
                  <input
                    type="text"
                    placeholder="E.g. Summer Vacation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block uppercase tracking-wider">Select Image</label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-bold py-4 text-white rounded-2xl transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-300' : 'bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-200'}`}
                >
                  {loading ? <FiLoader className="animate-spin" /> : <><FiUploadCloud /> Start Upload</>}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Your Gallery ({images.length})</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {images.length > 0 ? (
                images.map((img) => (
                  <div key={img._id} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-all">
                    <img src={img.imageUrl} className="w-full md:w-32 h-32 object-cover rounded-xl" alt={img.title} />
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-lg text-slate-800">{img.title}</h3>
                      <p className="text-slate-400 text-sm">{new Date(img.createdAt).toDateString()}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => handleEdit(img._id, img.title)} className="flex-1 md:flex-none p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"><FiEdit3 /></button>
                      <button onClick={() => deleteImage(img._id)} className="flex-1 md:flex-none p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><FiTrash2 /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <FiImage size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400">No images found in your gallery.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadForm;