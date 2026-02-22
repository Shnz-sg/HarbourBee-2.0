import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const OBJECT_PAGES = {
  order: "OrderDetail",
  pool: "PoolDetail",
  delivery: "DeliveryDetail",
  vendor_order: "VendorOrderDetail",
};

export default function ObjectLink({ type, id, label, className }) {
  const page = OBJECT_PAGES[type];
  if (!page || !id) return <span className={className}>{label || id || "—"}</span>;

  return (
    <Link
      to={createPageUrl(`${page}?id=${id}`)}
      className={`text-sky-600 hover:text-sky-800 hover:underline text-sm font-medium ${className || ""}`}
    >
      {label || id}
    </Link>
  );
}