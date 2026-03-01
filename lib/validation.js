export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif"
];

export const MAX_IMAGE_SIZE_MB = 5;

/**
 * Validate a product form object.
 * Returns an error string or null if valid.
 */
export function validateProductForm(form) {
  const name = form.product_name?.trim();
  const type = form.product_type?.trim().toLowerCase();
  const price = Number(form.price);

  if (!name) return "Product name is required.";
  if (!type) return "Product type is required.";
  if (!price || isNaN(price) || price <= 0)
    return "A valid price is required.";

  // Sizes required except for oversized
  if (type !== "oversized" && (!form.sizes || form.sizes.length === 0)) {
    return "Please select at least one size.";
  }

  return null;
}

/**
 * Validate a single image File before upload.
 * Returns an error string or null if valid.
 */
export function validateImageFile(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" — unsupported format. Use JPG, PNG, or WebP.`;
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `"${file.name}" — exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`;
  }
  return null;
}