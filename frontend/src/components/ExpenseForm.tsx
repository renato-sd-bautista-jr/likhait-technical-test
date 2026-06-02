/**
 * Form component for adding/editing expenses
 */

import React, { useState } from "react";
import { ExpenseFormData } from "../types";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { TextField, SelectBox, Button } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { createCategory } from "../services/api";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  categories?: Array<{ id: number; name: string }>;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
  categories,
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const [localCategories, setLocalCategories] = useState(categories || []);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const mergedCategories = localCategories.length > 0
    ? localCategories
    : EXPENSE_CATEGORIES.map((c) => ({ id: 0, name: c }));

  const categoryOptions = mergedCategories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    setAddingCategory(true);
    try {
      const newCat = await createCategory(trimmed);
      setLocalCategories((prev) => [...prev, newCat]);
      handleChange("category", newCat.name);
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch {
    } finally {
      setAddingCategory(false);
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const addCategoryLinkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "#0066cc",
    cursor: "pointer",
    fontSize: "13px",
    padding: "4px 0",
    textAlign: "left",
    textDecoration: "underline",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <div>
        <SelectBox
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          error={errors.category}
          fullWidth
          required
        />
        <button
          type="button"
          style={addCategoryLinkStyle}
          onClick={() => setShowNewCategory(!showNewCategory)}
        >
          {showNewCategory ? "Cancel" : "+ Add new category"}
        </button>
      </div>

      {showNewCategory && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
          <TextField
            label="New Category Name"
            type="text"
            placeholder="Enter category name"
            value={newCategoryName}
            fullWidth
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            type="button"
            variant="primary"
            disabled={addingCategory || !newCategoryName.trim()}
            onClick={handleAddCategory}
            style={{ whiteSpace: "nowrap", marginBottom: "1px" }}
          >
            {addingCategory ? "..." : "Add"}
          </Button>
        </div>
      )}

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
