import { X } from "lucide-react";
import GalleryGrid from "./GalleryGrid";
import UploadCard from "./UploadCard";

function MediaPicker({ open = true, onClose, title = "Select media" }) {
  if (!open) return null;

  return (
    <div className="rounded-[32px] border border-violet-100 bg-white/85 p-5 shadow-[0_24px_70px_rgba(91,76,143,0.12)] backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-black text-[#514aa3]">{title}</h3>
        <button onClick={onClose} className="admin-icon-button h-10 w-10" aria-label="Close media picker">
          <X size={17} />
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <UploadCard title="Add new media" />
        <GalleryGrid />
      </div>
    </div>
  );
}

export default MediaPicker;
