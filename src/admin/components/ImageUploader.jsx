import { ImagePlus } from "lucide-react";

function ImageUploader({ label = "Cover image", helper = "Recommended 1600 x 900 PNG or JPG." }) {
  return (
    <div className="rounded-[28px] border border-violet-100 bg-white/70 p-4">
      <p className="text-sm font-black text-[#514aa3]">{label}</p>
      <div className="mt-4 grid aspect-video place-items-center rounded-[24px] border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 to-white text-center">
        <div>
          <ImagePlus className="mx-auto text-violet-500" size={30} />
          <p className="mt-3 text-sm font-bold text-slate-500">{helper}</p>
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
