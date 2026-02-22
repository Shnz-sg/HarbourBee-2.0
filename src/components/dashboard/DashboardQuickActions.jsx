import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, Box, AlertTriangle, Layers, BarChart3 } from "lucide-react";

export default function DashboardQuickActions({ user }) {
  if (user.role === 'user') {
    return (
      <div className="flex gap-2 mt-4">
        <Button asChild size="sm">
          <Link to={createPageUrl("Products")}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Order
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={createPageUrl("Products")}>
            <Box className="w-4 h-4 mr-1.5" />
            Browse Products
          </Link>
        </Button>
      </div>
    );
  }

  if (user.role === 'ops_staff' || user.role === 'ops_admin') {
    return (
      <div className="flex gap-2 mt-4">
        <Button asChild variant="outline" size="sm">
          <Link to={createPageUrl("Exceptions")}>
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            View Exceptions
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={createPageUrl("Pools")}>
            <Layers className="w-4 h-4 mr-1.5" />
            View Pools
          </Link>
        </Button>
      </div>
    );
  }

  if (user.role === 'super_admin') {
    return (
      <div className="flex gap-2 mt-4">
        <Button asChild variant="outline" size="sm">
          <Link to={createPageUrl("Reports")}>
            <BarChart3 className="w-4 h-4 mr-1.5" />
            View Reports
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={createPageUrl("Exceptions")}>
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            View Exceptions
          </Link>
        </Button>
      </div>
    );
  }

  return null;
}