import React from "react";
import { Expense } from "../types";
import { formatCurrency } from "../utils/expenseUtils";
import { COLORS } from "../constants/colors";
import { getCategoryEmoji } from "../constants/categoryEmojis";

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  const cardStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${COLORS.primary.p02}, ${COLORS.primary.p03})`,
    border: `1px solid ${COLORS.primary.p04}`,
    borderRadius: "0.75rem",
    padding: "1.5rem",
    marginBottom: "2rem",
  };

  const headerStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: COLORS.primary.p09,
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 600,
    background: COLORS.primary.p06,
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "999px",
    marginLeft: "0.5rem",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "0.8rem",
    color: COLORS.primary.p08,
    borderBottom: `2px solid ${COLORS.primary.p04}`,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
    color: COLORS.primary.p09,
    borderBottom: `1px solid ${COLORS.primary.p04}`,
  };

  const emptyStyle: React.CSSProperties = {
    padding: "1rem 0",
    color: COLORS.primary.p08,
    fontSize: "0.9rem",
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        Recent Transactions
        <span style={badgeStyle}>Latest</span>
      </div>
      {expenses.length === 0 ? (
        <div style={emptyStyle}>No transactions yet.</div>
      ) : (
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
                <td style={tdStyle}>{expense.date}</td>
                <td style={tdStyle}>{expense.description}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span>{getCategoryEmoji(expense.category)}</span>
                    <span>{expense.category}</span>
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
