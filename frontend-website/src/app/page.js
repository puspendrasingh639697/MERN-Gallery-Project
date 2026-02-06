"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { FiLogOut, FiHeart, FiImage } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";


export default function Home() {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    fetchImages();
    return () => unsubscribe();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/images/all?sort=${sortBy}`);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [sortBy]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const handleLike = async (imageId) => {
    if (!user) return alert("Pehle Login karo bhai!");

    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        `http://localhost:5000/api/images/like/${imageId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImages((prevImages) =>
        prevImages.map((img) => (img._id === imageId ? res.data : img))
      );
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
      alert("Token validation fail ho gaya!");
    }
  };

  const filteredImages = onlyLiked
    ? images.filter((img) => img.likes?.includes(user?.uid))
    : images;

  const displayedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 font-medium"> Images Gallery...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
          <FiImage /> Images Gallery Project
        </h1>
        {user ? (
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition font-bold"
          >
            <FiLogOut size={18} /> Logout
          </button>

        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 bg-blue-400 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <FcGoogle size={20} /> Login with Google
          </button>


        )}
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filter & Sort Controls */}
        <div className="flex flex-col items-center mb-12 gap-6">
          {user && (
            <div className="flex flex-col items-center">
              <h2 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Discovery</h2>
              <div className="inline-flex p-1 bg-gray-200 rounded-xl">
                <button
                  onClick={() => setOnlyLiked(false)}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition ${!onlyLiked ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                  All Photos
                </button>
                <button
                  onClick={() => setOnlyLiked(true)}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition ${onlyLiked ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500'}`}
                >
                  My Liked
                </button>
              </div>
            </div>
          )}

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-2 border-blue-500 p-2 rounded-xl bg-white font-bold shadow-md outline-none focus:ring-2 focus:ring-blue-300 transition-all cursor-pointer text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedImages.length > 0 ? (
            displayedImages.map((img) => (
              <div key={img._id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={img.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={img.title} />
                </div>
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-none mb-1">{img.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">{new Date(img.createdAt).toDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleLike(img._id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${img.likes?.includes(user?.uid)
                      ? 'bg-pink-50 text-pink-600'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                  >
                    <FiHeart className={`text-lg ${img.likes?.includes(user?.uid) ? 'fill-current' : ''}`} />
                    <span className="font-bold">{img.likeCount || 0}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-gray-800">Gallery Khali Hai</h3>
              <p className="text-gray-500">Pehle kuch photos like karo ya upload karo!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 text-center border-t border-gray-100 text-gray-400 text-sm mt-20">
        @ Puspendra Singh | 2026
      </footer>
    </div>
  );
}
