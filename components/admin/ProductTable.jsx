"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { colorHex, colorLabel } from "@/constants/colors";
import { formatType } from "@/constants/productTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductTableSkeleton from "@/components/skeletons/ProductTableSkeleton";
import AddProductDialog    from "./AddProduct";
import EditProductDialog   from "./EditProduct";
import DeleteProductDialog from "./DeleteProduct";

const PER_PAGE = 10;

export default function ProductTable() {
  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editOpen,     setEditOpen]     = useState(false);
  const [deleteOpen,   setDeleteOpen]   = useState(false);

  // ── Data ──────────────────────────────────────────────────
  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (!error && data) setProducts(data);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Pagination ─────────────────────────────────────────────
  const totalPages = Math.ceil(products.length / PER_PAGE);
  const paginated  = products.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  function getPageNumbers() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }

  function openEdit(product)   { setEditTarget(product);   setEditOpen(true);   }
  function openDelete(product) { setDeleteTarget(product); setDeleteOpen(true); }

  function handleSuccess() {
    if (deleteOpen && currentPage > 1 && paginated.length === 1) setCurrentPage((p) => p - 1);
    fetchProducts();
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-semibold text-neutral-900">Products</h1>
          <p className="font-sans text-xs text-neutral-400 mt-0.5 tracking-wide">
            {products.length} {products.length === 1 ? "item" : "items"} in inventory
          </p>
        </div>
        <AddProductDialog onSuccess={fetchProducts} />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">

        {/* Skeleton */}
        {loading && <ProductTableSkeleton rows={6} />}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Package size={18} className="text-neutral-400" />
            </div>
            <p className="font-sans text-sm text-neutral-400">No products yet</p>
            <AddProductDialog onSuccess={fetchProducts} />
          </div>
        )}

        {/* Table */}
        {!loading && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  {["Image", "Type", "Name", "Price", "Status", "Description", "Colors", "Sizes", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-sans text-[0.65rem] tracking-[0.15em] uppercase text-neutral-400 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {paginated.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors duration-100 group">

                    {/* Image */}
                    <td className="px-4 py-3">
                      {product.image_urls?.[0] ? (
                        <div className="relative w-10 h-12 rounded overflow-hidden bg-neutral-100 shrink-0">
                          <Image src={product.image_urls[0]} alt="" fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="w-10 h-12 rounded bg-neutral-100 flex items-center justify-center">
                          <span className="text-neutral-300 text-[0.55rem]">—</span>
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[0.6rem] tracking-widest uppercase font-medium text-neutral-600 border-neutral-200 bg-neutral-50">
                        {formatType(product.product_type)}
                      </Badge>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <p className="font-serif text-sm text-neutral-900 whitespace-nowrap max-w-40 truncate">
                        {product.product_name}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm text-neutral-700 whitespace-nowrap">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-[0.6rem] tracking-widest uppercase font-medium ${
                        product.is_active !== false
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-neutral-100 text-neutral-400 border-neutral-200"
                      }`}>
                        {product.is_active !== false ? "Active" : "Hidden"}
                      </Badge>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 max-w-45">
                      <p className="font-sans text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {product.product_description || <span className="italic text-neutral-300">—</span>}
                      </p>
                    </td>

                    {/* Colors */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(product.colors ?? []).map((c) => (
                          <span key={c} className="inline-flex items-center gap-1 font-sans text-[0.6rem] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5">
                            <span className="w-2 h-2 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: colorHex(c) }} />
                            {colorLabel(c)}
                          </span>
                        ))}
                        {!product.colors?.length && <span className="text-xs text-neutral-300 italic">—</span>}
                      </div>
                    </td>

                    {/* Sizes */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(product.sizes ?? []).map((s) => (
                          <Badge key={s} variant="secondary" className="font-sans text-[0.6rem] font-medium text-neutral-600 px-1.5 py-0.5 rounded">
                            {s}
                          </Badge>
                        ))}
                        {!product.sizes?.length && <span className="text-xs text-neutral-300 italic">—</span>}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"
                            className="w-7 h-7 rounded-md text-neutral-300 hover:text-neutral-700 hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-all duration-150"
                          >
                            <MoreHorizontal size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 rounded-xl border-neutral-100 shadow-md font-sans text-xs">
                          <DropdownMenuItem onClick={() => openEdit(product)} className="gap-2 text-neutral-700 cursor-pointer rounded-lg">
                            <Pencil size={12} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(product)} className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer rounded-lg">
                            <Trash2 size={12} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-neutral-100 px-4 py-3 flex items-center justify-between">
            <p className="font-sans text-xs text-neutral-400">Page {currentPage} of {totalPages}</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage((p) => p - 1); }}
                    className={`text-xs ${currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}`} />
                </PaginationItem>
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink href="#" isActive={currentPage === page}
                        onClick={(e) => { e.preventDefault(); setCurrentPage(page); }} className="text-xs">{page}</PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage((p) => p + 1); }}
                    className={`text-xs ${currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}`} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EditProductDialog   product={editTarget}   open={editOpen}   onOpenChange={setEditOpen}   onSuccess={handleSuccess} />
      <DeleteProductDialog product={deleteTarget} open={deleteOpen} onOpenChange={setDeleteOpen} onSuccess={handleSuccess} />
    </div>
  );
}