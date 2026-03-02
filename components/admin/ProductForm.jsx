"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { validateImageFile, MAX_IMAGE_SIZE_MB } from "@/lib/validation";
import { ALL_COLORS } from "@/constants/colors";
import { ALL_SIZES } from "@/constants/sizes";
import { ALL_TYPES } from "@/constants/productTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

export function emptyForm() {
  return {
    product_name:        "",
    product_type:        "",
    price:               "",
    product_description: "",
    colors:              [],
    sizes:               [],
    image_urls:          [],
    is_active:           true,
  };
}


// Image Uploader
function ImageUploader({ images, onChange }) {
  const [uploading,    setUploading]    = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const inputRef = useRef(null);

  async function handleFiles(files) {
    if (!files?.length) return;

    const errors = [];
    const valid  = [];
    for (const file of Array.from(files)) {
      const err = validateImageFile(file);
      if (err) errors.push(err);
      else valid.push(file);
    }
    setUploadErrors(errors);
    if (!valid.length) return;

    setUploading(true);
    const urls = [...images];
    for (const file of valid) {
      const ext      = file.name.split(".").pop().toLowerCase();
      const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("products")
        .upload(filename, file, { cacheControl: "3600", upsert: false, contentType: file.type });

      if (error) {
        errors.push(`"${file.name}" — upload failed: ${error.message}`);
        setUploadErrors([...errors]);
      } else {
        const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(data.path);
        urls.push(publicUrl);
      }
    }
    onChange(urls);
    setUploading(false);
  }

  function removeImage(idx) {
    const next = images.filter((_, i) => i !== idx);
    onChange(next);
    if (previewIndex !== null)
      setPreviewIndex(next.length === 0 ? null : Math.min(previewIndex, next.length - 1));
  }

  function moveImage(from, to) {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setPreviewIndex(to);
  }

  function openPicker() { setUploadErrors([]); inputRef.current?.click(); }

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <button type="button" onClick={openPicker}
        className="flex items-center justify-center gap-2 w-full h-20 rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 transition-all duration-200 font-sans text-xs tracking-wide"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            {/* Loading Icon */}
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Uploading…
          </span>
        ) : (
          <span className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-1.5"><Upload size={14} /> Click to upload multiple images</span>
            <span className="text-[0.6rem] text-neutral-300">JPG, PNG, WebP · Max {MAX_IMAGE_SIZE_MB}MB each</span>
          </span>
        )}
      </button>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif" multiple className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />

      {/* Errors */}
      {uploadErrors.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 flex flex-col gap-1">
          {uploadErrors.map((e, i) => <p key={i} className="font-sans text-xs text-red-500">{e}</p>)}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={url + i} onClick={() => setPreviewIndex(i)}
              className="relative w-16 h-20 rounded-md overflow-hidden bg-neutral-100 group cursor-pointer ring-1 ring-neutral-200 hover:ring-neutral-400 transition-all"
            >
              <Image src={url} alt={`img-${i}`} fill className="object-cover" sizes="64px" />
              {i === 0 && (
                <span className="absolute top-0 left-0 right-0 bg-neutral-900/80 text-white text-[0.45rem] text-center py-0.5 tracking-widest uppercase">Main</span>
              )}
              <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={8} className="text-white" />
              </button>
              <span className="absolute bottom-0 right-0 bg-black/40 text-white text-[0.45rem] px-1 py-0.5">{i + 1}/{images.length}</span>
            </div>
          ))}
          <button type="button" onClick={openPicker}
            className="w-16 h-20 rounded-md border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-1 text-neutral-300 hover:border-neutral-400 hover:text-neutral-500 transition-all"
          >
            <Plus size={14} /><span className="text-[0.5rem] font-sans">Add</span>
          </button>
        </div>
      )}

      <p className="font-sans text-[0.65rem] text-neutral-400">Click image to preview · Use arrows to reorder · First = main</p>

      {/* Lightbox */}
      {previewIndex !== null && images.length > 0 && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewIndex(null)}
        >
          <div className="relative bg-white rounded-sm overflow-hidden shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full aspect-3/4 bg-neutral-100">
              <Image src={images[previewIndex]} alt={`Preview ${previewIndex + 1}`} fill className="object-cover" sizes="384px" />
              {previewIndex > 0 && (
                <button type="button" onClick={() => setPreviewIndex(previewIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                ><ChevronLeft size={16} className="text-neutral-700" /></button>
              )}
              {previewIndex < images.length - 1 && (
                <button type="button" onClick={() => setPreviewIndex(previewIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                ><ChevronRight size={16} className="text-neutral-700" /></button>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <button type="button" disabled={previewIndex === 0} onClick={() => moveImage(previewIndex, previewIndex - 1)}
                  className="w-7 h-7 rounded-sm border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                ><ChevronLeft size={12} /></button>
                <span className="font-sans text-xs text-neutral-400 w-10 text-center">{previewIndex + 1} / {images.length}</span>
                <button type="button" disabled={previewIndex === images.length - 1} onClick={() => moveImage(previewIndex, previewIndex + 1)}
                  className="w-7 h-7 rounded-sm border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                ><ChevronRight size={12} /></button>
                {previewIndex === 0 && (
                  <span className="font-sans text-[0.6rem] tracking-widest uppercase bg-neutral-900 text-white px-2 py-0.5 rounded-full ml-1">Main</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => removeImage(previewIndex)}
                  className="flex items-center gap-1 font-sans text-xs text-red-400 hover:text-red-600 transition-colors"
                ><X size={11} /> Remove</button>
                <button type="button" onClick={() => setPreviewIndex(null)}
                  className="w-7 h-7 rounded-sm border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-neutral-50 transition-all"
                ><X size={13} /></button>
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-1.5 px-4 pt-2 pb-4 overflow-x-auto">
                {images.map((url, i) => (
                  <button key={i} type="button" onClick={() => setPreviewIndex(i)}
                    className={`relative shrink-0 w-10 h-12 overflow-hidden transition-all duration-150 ${i === previewIndex ? "ring-2 ring-neutral-400 opacity-100" : "opacity-40 hover:opacity-70"}`}
                  ><Image src={url} alt="" fill className="object-cover" sizes="40px" /></button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Color Selector
function ColorSelector({ values, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_COLORS.map(({ label, value, hex }) => {
        const selected = values.includes(value);
        return (
          <button key={value} type="button" onClick={() => onChange(selected ? values.filter((v) => v !== value) : [...values, value])}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-sans transition-all duration-150 ${selected ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}
          >
            <span className={`w-3 h-3 rounded-full shrink-0 ${hex === "#FFFFFF" ? "border border-gray-300" : "border border-black/10"}`} style={{ backgroundColor: hex }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// Size Selector
function SizeSelector({ values, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_SIZES.map((s) => (
        <button key={s} type="button" onClick={() => onChange(values.includes(s) ? values.filter((v) => v !== s) : [...values, s])}
          className={`w-11 h-9 rounded-md border text-xs font-medium font-sans transition-all duration-150 ${values.includes(s) ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-500"}`}
        >{s}</button>
      ))}
    </div>
  );
}

// Main ProductForm
export default function ProductForm({ form, setForm }) {
  // form starts as {} before EditProductDialog's setTimeout fires — guard every array field
  const colors    = form.colors     ?? [];
  const sizes     = form.sizes      ?? [];
  const imageUrls = form.image_urls ?? [];

  function field(key) {
    return (val) => setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="flex flex-col gap-5 py-1">

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
        <div>
          <p className="font-sans text-sm font-medium text-neutral-700">Product Active</p>
          <p className="font-sans text-xs text-neutral-400 mt-0.5">Inactive products are hidden from the storefront</p>
        </div>
        <Switch checked={form.is_active ?? true} onCheckedChange={field("is_active")} />
      </div>

      {/* Name + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="font-sans text-[0.7rem] tracking-widest uppercase text-neutral-500">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input value={form.product_name ?? ""} onChange={(e) => field("product_name")(e.target.value)}
            placeholder="e.g. Structured Boxy Tee"
            className="h-9 text-sm border-neutral-200 focus-visible:ring-neutral-900 focus-visible:ring-1" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-sans text-[0.7rem] tracking-widest uppercase text-neutral-500">
            Type <span className="text-red-500">*</span>
          </Label>
          <Select value={form.product_type ?? ""} onValueChange={field("product_type")}>
            <SelectTrigger className="h-9 text-sm border-neutral-200 focus:ring-neutral-900 focus:ring-1 w-full">
              <SelectValue placeholder="Select type…" />
            </SelectTrigger>
            <SelectContent>
              {ALL_TYPES.map(({ label, value }) => (
                <SelectItem key={value} value={value} className="text-sm">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1.5">
        <Label className="font-sans text-[0.7rem] tracking-widest uppercase text-neutral-500">
          Price ($) <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-sm text-neutral-400 pointer-events-none">$</span>
          <Input type="number" min="0" step="0.01" value={form.price ?? ""} onChange={(e) => field("price")(e.target.value)}
            placeholder="0.00" className="h-9 pl-7 text-sm border-neutral-200 focus-visible:ring-neutral-900 focus-visible:ring-1" />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label className="font-sans text-[0.7rem] tracking-widest uppercase text-neutral-500">Description</Label>
        <Textarea value={form.product_description ?? ""} onChange={(e) => field("product_description")(e.target.value)}
          placeholder="Short product description…" rows={2}
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 font-sans text-sm text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 resize-none" />
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="font-sans text-[0.7rem] tracking-widest uppercase text-neutral-500">Colors</Label>
          {colors.length > 0 && <span className="font-sans text-[0.65rem] text-neutral-400">{colors.length} selected</span>}
        </div>
        <ColorSelector values={colors} onChange={field("colors")} />
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="font-sans text-[0.7rem] tracking-widest uppercase text-neutral-500">Sizes</Label>
          {sizes.length > 0 && <span className="font-sans text-[0.65rem] text-neutral-400">{sizes.length} selected</span>}
        </div>
        <SizeSelector values={sizes} onChange={field("sizes")} />
      </div>

      {/* Images */}
      <div className="flex flex-col gap-1.5">
        <Label className="font-sans text-[0.7rem] tracking-widest uppercase text-neutral-500">
          Images <span className="text-neutral-300 font-normal normal-case tracking-normal">— first image is main display</span>
        </Label>
        <ImageUploader images={imageUrls} onChange={field("image_urls")} />
      </div>

    </div>
  );
}