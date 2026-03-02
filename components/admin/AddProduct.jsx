"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { validateProductForm } from "@/lib/validation";
import ProductForm from "./ProductForm";

function emptyForm() {
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

export default function AddProductDialog({ onSuccess }) {
  const [open,    setOpen]    = useState(false);
  const [form,    setForm]    = useState(emptyForm());
  const [saving,  setSaving]  = useState(false);
  const [formErr, setFormErr] = useState("");

  function handleOpen() {
    setForm(emptyForm());
    setFormErr("");
    setOpen(true);
  }

  async function handleAdd() {
    const err = validateProductForm(form);
    if (err) { setFormErr(err); return; }

    setSaving(true);
    const { error } = await supabase.from("products").insert([{
      product_name:        form.product_name.trim(),
      product_type:        form.product_type,
      price:               Number(form.price),
      product_description: form.product_description?.trim() ?? "",
      colors:              form.colors,
      sizes:               form.sizes,
      image_urls:          form.image_urls,
      is_active:           form.is_active ?? true,
    }]);
    setSaving(false);

    if (error) {
      setFormErr("Failed to add product. Please try again.");
      toast.error("Failed to add product", { description: error.message });
      return;
    }

    toast.success("Product added", {
      description: `"${form.product_name}" is now in your inventory.`,
    });
    setOpen(false);
    onSuccess?.();
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="h-9 rounded-lg bg-neutral-900 hover:bg-black text-white font-sans text-[0.75rem] tracking-widest uppercase gap-2 px-5 transition-all duration-200"
      >
        <Plus size={13} />
        Add Product
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Add New Product</DialogTitle>
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
              onClick={handleAdd}
              disabled={saving}
              className="rounded-lg h-9 px-5 bg-neutral-900 hover:bg-black text-white font-sans text-xs tracking-wide"
            >
              {saving ? "Saving…" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}