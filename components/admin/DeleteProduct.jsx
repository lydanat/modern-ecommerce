"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function extractStoragePath(url) {
  try {
    const marker = "/object/public/products/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  } catch {
    return null;
  }
}

export default function DeleteProductDialog({ product, open, onOpenChange, onSuccess }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    const imageUrls = product.image_urls ?? [];

    // Step 1: Delete images from Storage
    let storageOk    = true;
    let deletedCount = 0;

    if (imageUrls.length > 0) {
      const paths = imageUrls.map(extractStoragePath).filter(Boolean);

      if (paths.length > 0) {
        const { data, error: storageError } = await supabase.storage
          .from("products")
          .remove(paths);

        if (storageError) {
          storageOk = false;
          console.error("Storage deletion error:", storageError);
        } else {
          deletedCount = data?.length ?? paths.length;
        }
      }
    }

    // Step 2: Delete the DB row
    const { error: dbError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    setDeleting(false);

    if (dbError) {
      toast.error("Delete failed", { description: dbError.message });
      return;
    }

    // Feedback
    if (!storageOk) {
      toast.warning("Product deleted — storage cleanup incomplete", {
        description: `"${product.product_name}" was removed but some images may remain in storage. Check Supabase Storage manually.`,
        duration: 6000,
      });
    } else if (imageUrls.length > 0) {
      toast.success("Product deleted", {
        description: `"${product.product_name}" and ${deletedCount} image${deletedCount !== 1 ? "s" : ""} removed from storage.`,
      });
    } else {
      toast.success("Product deleted", {
        description: `"${product.product_name}" has been removed.`,
      });
    }

    onOpenChange(false);
    onSuccess?.();
  }

  const imageCount = product?.image_urls?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-lg border-neutral-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Delete Product</DialogTitle>
          <DialogDescription asChild>
            <div className="font-sans text-sm text-neutral-500 leading-relaxed pt-1 flex flex-col gap-2">
              <p>
                Are you sure you want to delete{" "}
                <span className="font-medium text-neutral-900">{product?.product_name}</span>?
              </p>
              {imageCount > 0 && (
                <p className="text-xs bg-amber-50 border border-amber-100 text-amber-700 rounded-lg px-3 py-2">
                  This will also permanently delete {imageCount} image{imageCount !== 1 ? "s" : ""} from storage.
                </p>
              )}
              <p className="text-xs text-neutral-400">This action cannot be undone.</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-lg h-9 px-5 font-sans text-xs border-neutral-200">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="destructive"
            className="rounded-lg h-9 px-5 font-sans text-xs tracking-wide"
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}