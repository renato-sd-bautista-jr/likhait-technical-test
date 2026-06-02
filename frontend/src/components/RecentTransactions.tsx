import React from "react";
import { Expense } from "../types";
import { formatCurrency, formatDate } from "../utils/expenseUtils";
import { getCategoryEmoji } from "../constants/categoryEmojis";
import { COLORS } from "../constants/colors";

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  if (expenses.length === 0) return null;

  const containerStyle: React.CSSProperties = {
    backgroundColor: COLORS.background.main,
    borderRadius: "0.5rem",
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
    marginBottom: "32px",
  };

  const headerStyle: React.CSSProperties = {
    padding: "1rem 1.25rem",
    backgroundColor: COLORS.background.card,
    borderBottom: `1px solid ${COLORS.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    color: COLORS.text.primary,
    margin: 0,
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle: React.CSSProperties = {
    padding: "0.6rem 1.25rem",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "12px",
    color: COLORS.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background.card,
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.6rem 1.25rem",
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.text.primary,
    fontSize: "14px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Recent Transactions</h3>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Category</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td style={tdStyle}>{formatDate(new Date(expense.date))}</td>
              <td style={tdStyle}>{expense.description}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{getCategoryEmoji(expense.category)}</span>
                  <span>{expense.category}</span>
                </span>
              </td>
              <td
                style={{
                  ...tdStyle,
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                {formatCurrency(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
