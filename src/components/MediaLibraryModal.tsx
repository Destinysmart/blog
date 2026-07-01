import { useState, useEffect, useRef } from "react";
import { 
  X, Search, Upload, Image as ImageIcon, Trash2, 
  Copy, Check, Calendar, HardDrive, Sparkles, Edit3, Save 
} from "lucide-react";
import { optimizeImage, seoFriendlyFilename } from "../lib/imageOptimizer";

interface MediaItem {
  id: string;
  filename: string;
  thumbnailFilename: string;
  url: string;
  thumbnailUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
  altText: string;
  title: string;
  caption: string;
  description: string;
  createdAt: string;
  aiMetadata?: {
    context: string;
    keywords: string[];
    schemaJsonLd: any;
  };
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  title?: string;
}

export function MediaLibraryModal({ isOpen, onClose, onSelect, title = "Centralized Media Library" }: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Attribute Edit States
  const [editTitle, setEditTitle] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [detailsSavedMsg, setDetailsSavedMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMediaItems(data);
      if (data.length > 0 && !selectedItem) {
        setSelectedItem(data[0]);
        loadItemFields(data[0]);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadItemFields = (item: MediaItem) => {
    setEditTitle(item.title || "");
    setEditAltText(item.altText || "");
    setEditCaption(item.caption || "");
    setEditDescription(item.description || "");
  };

  const handleSelectItem = (item: MediaItem) => {
    setSelectedItem(item);
    loadItemFields(item);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSavingDetails(true);
    setDetailsSavedMsg("");

    try {
      const res = await fetch(`/api/media/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          altText: editAltText,
          caption: editCaption,
          description: editDescription
        })
      });
      const updated = await res.json();
      
      // Update local state
      setMediaItems(prev => prev.map(m => m.id === updated.id ? updated : m));
      setSelectedItem(updated);
      setDetailsSavedMsg("SEO Metadata updated successfully!");
      setTimeout(() => setDetailsSavedMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setDetailsSavedMsg("Failed to update details.");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleDeleteItem = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title || item.filename}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/media/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        setMediaItems(prev => prev.filter(m => m.id !== item.id));
        if (selectedItem?.id === item.id) {
          setSelectedItem(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Optimize image client-side to WebP format
      const optimized = await optimizeImage(file);
      const seoName = seoFriendlyFilename(file.name);

      const payload = {
        file: optimized.fileData,
        thumbnail: optimized.thumbData,
        originalName: file.name,
        title: seoName.replace(".webp", "").replace(/-/g, " ")
      };

      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const newMedia = await res.json();
      setMediaItems(prev => [newMedia, ...prev]);
      setSelectedItem(newMedia);
      loadItemFields(newMedia);
      setActiveTab("browse");
    } catch (err) {
      console.error(err);
      alert("Failed to upload or optimize image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleFileUpload(file);
      } else {
        alert("Only image files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = mediaItems.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(search) ||
      item.altText?.toLowerCase().includes(search) ||
      item.filename?.toLowerCase().includes(search) ||
      item.originalName?.toLowerCase().includes(search)
    );
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
              <ImageIcon className="h-5.5 w-5.5 text-brand-500" />
              {title}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Centralized, WebP optimized, SEO and AI structured media storage.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-8 bg-gray-50 border-b border-gray-150">
          <div className="flex gap-1.5 py-3">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "browse" 
                  ? "bg-white text-gray-950 shadow-xs border border-gray-200" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-150"
              }`}
            >
              Browse Library ({mediaItems.length})
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "upload" 
                  ? "bg-white text-gray-950 shadow-xs border border-gray-200" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-150"
              }`}
            >
              Upload New
            </button>
          </div>

          {activeTab === "browse" && (
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search media library..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === "upload" ? (
            /* Upload View */
            <div className="flex-1 p-8 flex flex-col items-center justify-center">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full max-w-xl p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive 
                    ? "border-brand-500 bg-brand-50/40" 
                    : "border-gray-250 hover:border-brand-400 hover:bg-gray-50/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-brand-500"></div>
                      <Sparkles className="absolute h-5 w-5 text-brand-500 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Optimizing and Analyzing...</p>
                      <p className="text-xs text-gray-500 mt-1">Converting to WebP and generating AI structured context tags.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-brand-50 text-brand-500 rounded-2xl">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-950">Drag & drop your image here</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">or click to browse local files</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-md">
                      Supports PNG, JPG, WEBP, GIF (Auto Optimized)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Browse View */
            <div className="flex-1 flex overflow-hidden">
              
              {/* Image Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-100 border-t-brand-500"></div>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                    <ImageIcon className="h-12 w-12 mb-3 stroke-1 text-gray-300" />
                    <p className="text-sm font-bold text-gray-900">No media assets found</p>
                    <p className="text-xs text-gray-500 mt-1">Upload images to populate your centralized library.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredItems.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                          selectedItem?.id === item.id 
                            ? "border-brand-500 bg-brand-50/10 ring-4 ring-brand-500/10" 
                            : "border-gray-200 hover:border-gray-350"
                        }`}
                      >
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.altText} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                          <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                          <p className="text-[9px] text-gray-300 font-medium mt-0.5">{formatBytes(item.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Asset Information & Settings Panel */}
              {selectedItem && (
                <div className="w-80 border-l border-gray-150 overflow-y-auto bg-gray-50/50 p-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Asset Details</h3>
                      <div className="rounded-xl overflow-hidden aspect-video border border-gray-200 shadow-xs mb-3 bg-white flex items-center justify-center relative group">
                        <img 
                          src={selectedItem.url} 
                          alt={selectedItem.altText} 
                          className="max-h-full max-w-full object-contain"
                        />
                        <button 
                          onClick={() => handleCopyUrl(selectedItem.url, selectedItem.id)}
                          className="absolute bottom-2 right-2 bg-gray-950/80 text-white p-2 rounded-lg hover:bg-gray-950 transition-colors cursor-pointer"
                          title="Copy Image URL"
                        >
                          {copiedId === selectedItem.id ? (
                            <Check className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-500 font-medium">
                        <p className="font-bold text-gray-950 truncate" title={selectedItem.originalName}>
                          {selectedItem.originalName}
                        </p>
                        <p className="font-mono text-[10px] text-gray-400">{selectedItem.filename}</p>
                        <div className="flex items-center gap-1.5 text-[10.5px] mt-2">
                          <HardDrive className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatBytes(selectedItem.size)} • WebP</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px]">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI / AEO Insights Panel */}
                    {selectedItem.aiMetadata && (
                      <div className="p-3.5 bg-brand-50/50 rounded-xl border border-brand-100">
                        <h4 className="text-[10px] font-bold text-brand-900 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                          <Sparkles className="h-3.5 w-3.5 text-brand-500" /> AI / AEO Optimization
                        </h4>
                        <p className="text-[11px] text-brand-850 font-medium italic">
                          "{selectedItem.aiMetadata.context}"
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {selectedItem.aiMetadata.keywords.map((kw, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-bold text-brand-700 bg-brand-100/50 border border-brand-100 px-1.5 py-0.5 rounded"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SEO Metadata Fields Editor */}
                    <form onSubmit={handleSaveDetails} className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                          <Edit3 className="h-3.5 w-3.5" /> SEO Metadata Editor
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Image Title</label>
                            <input 
                              type="text"
                              className="w-full text-xs font-medium p-2 bg-white border border-gray-250 rounded-lg focus:outline-none focus:border-brand-500"
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Alt Text (AEO Index)</label>
                            <input 
                              type="text"
                              className="w-full text-xs font-medium p-2 bg-white border border-gray-250 rounded-lg focus:outline-none focus:border-brand-500"
                              value={editAltText}
                              onChange={e => setEditAltText(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Caption</label>
                            <input 
                              type="text"
                              className="w-full text-xs font-medium p-2 bg-white border border-gray-250 rounded-lg focus:outline-none focus:border-brand-500"
                              value={editCaption}
                              onChange={e => setEditCaption(e.target.value)}
                              placeholder="Display caption..."
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Description (AEO Context)</label>
                            <textarea 
                              rows={2}
                              className="w-full text-xs font-medium p-2 bg-white border border-gray-250 rounded-lg focus:outline-none focus:border-brand-500 resize-none"
                              value={editDescription}
                              onChange={e => setEditDescription(e.target.value)}
                              placeholder="Describe image purpose..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button 
                          type="button"
                          onClick={() => handleDeleteItem(selectedItem)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Asset"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <button 
                          type="submit"
                          disabled={isSavingDetails}
                          className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Save className="h-3.5 w-3.5" />
                          {isSavingDetails ? "Saving..." : "Save SEO"}
                        </button>
                      </div>

                      {detailsSavedMsg && (
                        <p className="text-[10px] font-bold text-green-600 text-right mt-1 animate-fade-in">
                          {detailsSavedMsg}
                        </p>
                      )}
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-150 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onSelect(selectedItem)}
                      className="w-full bg-gray-900 hover:bg-gray-950 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Select Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
