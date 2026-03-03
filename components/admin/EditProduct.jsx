"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import { validateProductForm } from "@/lib/validation";

export default function EditProductDialog({ product, open, onOpenChange, onSuccess }) {
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const [formErr, setFormErr] = useState("");

  // Defer setState out of the synchronous effect to fix cascading render warning
  useEffect(() => {
    if (!product) return;
    const t = setTimeout(() => {
      setForm({
        product_name:        product.product_name        ?? "",
        product_type:        product.product_type        ?? "",
        price:               product.price               ?? "",
        product_description: product.product_description ?? "",
        colors:              product.colors              ?? [],
        sizes:               product.sizes               ?? [],
        image_urls:          product.image_urls          ?? [],
        is_active:           product.is_active           ?? true,
      });
      setFormErr("");
    }, 0);
    return () => clearTimeout(t);
  }, [product]);

  async function handleEdit() {
    const err = validateProductForm(form);
    if (err) { setFormErr(err); return; }

    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update({
        product_name:        form.product_name.trim(),
        product_type:        form.product_type,
        price:               Number(form.price),
        product_description: form.product_description?.trim() ?? "",
        colors:              form.colors,
        sizes:               form.sizes,
        image_urls:          form.image_urls,
        is_active:           form.is_active ?? true,
      })
      .eq("id", product.id);
    setSaving(false);

    if (error) {
      setFormErr("Failed to update product. Please try again.");
      toast.error("Update failed", { description: error.message });
      return;
    }

    toast.success("Product updated", {
      description: `"${form.product_name}" has been saved.`,
    });
    onOpenChange(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="
        left-[50%]! top-[50%]! translate-x-[-50%]! translate-y-[-50%]!
        w-[calc(100%-2rem)]
        sm:w-full sm:max-w-xl
        max-h-[88dvh] overflow-y-auto
        rounded-lg
        shadow-xl
        p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Product</DialogTitle>
        </DialogHeader>

        <ProductForm form={form} setForm={setForm} />

        {formErr && (
          <p className="font-sans text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {formErr}
          </p>
        )}

        <DialogFooter className="gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-lg h-9 px-5 font-sans text-xs border-neutral-200">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleEdit}
            disabled={saving}
            className="rounded-lg h-9 px-5 bg-neutral-900 hover:bg-black text-white font-sans text-xs tracking-wide"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}