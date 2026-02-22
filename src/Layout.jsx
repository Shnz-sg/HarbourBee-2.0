import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PublicLayout from "@/components/layouts/PublicLayout";

// Define which pages use PublicLayout
const PUBLIC_PAGES = [
  "Landing",
  "Shop",
  "Cart",
  "Checkout",
  "ProductDetail",
  "Categories",
  "CategoryCollection"
];

export default function Layout({ children, currentPageName }) {
  const isPublicPage = PUBLIC_PAGES.includes(currentPageName);

  if (isPublicPage) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  return <AdminLayout currentPageName={currentPageName}>{children}</AdminLayout>;
}