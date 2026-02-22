import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Edit, Archive, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from "sonner";

export default function AdminCategories() {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    sort_order: 0,
    status: "active"
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list("sort_order", 500),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return base44.entities.Category.create({ ...data, slug });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category created successfully");
      setShowDialog(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return base44.entities.Category.update(id, { ...data, slug });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category updated successfully");
      setShowDialog(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update category"),
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, status }) =>
      base44.entities.Category.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category archived successfully");
    },
    onError: () => toast.error("Failed to archive category"),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData((prev) => ({ ...prev, image: file_url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      sort_order: category.sort_order || 0,
      status: category.status,
    });
    setShowDialog(true);
  };

  const handleArchive = (category) => {
    if (
      window.confirm(
        `Archive "${category.name}"? It will be hidden from public pages.`
      )
    ) {
      archiveMutation.mutate({
        id: category.id,
        status: category.status === "active" ? "inactive" : "active",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      sort_order: 0,
      status: "active",
    });
    setEditingCategory(null);
  };

  const handleNewCategory = () => {
    resetForm();
    setShowDialog(true);
  };

  return (
    <div>
      <PageHeader title="Categories" subtitle="Manage product categories">
        <Button onClick={handleNewCategory} size="sm" className="h-8">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Category
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full mx-auto" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 mb-4">No categories yet</p>
          <Button onClick={handleNewCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Category
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600">
                    {category.slug}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        category.status === "active" ? "default" : "secondary"
                      }
                    >
                      {category.status === "active" ? "Active" : "Archived"}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(category.created_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(category)}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Engine Room"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>

            <div>
              <Label>Category Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded"
                />
              )}
            </div>

            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <p className="text-xs text-slate-500 mt-1">
                Lower numbers appear first
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}