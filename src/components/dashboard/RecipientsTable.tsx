"use client";

import { motion, useReducedMotion } from "framer-motion";
import { INDUSTRIES } from "@/lib/industries";
import { Badge, Button } from "./ui";

export type Recipient = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  industry: string | null;
  created_at: string;
};

/**
 * The list as a table rather than stacked cards.
 *
 * Fifty rows of cards is a great deal of scrolling and truncates the address,
 * which is the one field that has to be readable in full to be checked.
 */
const RecipientsTable = ({
  rows,
  selected,
  onToggleRow,
  onToggleAll,
  allChecked,
  onToggleActive,
  onSetIndustry,
  onDelete,
}: {
  rows: Recipient[];
  selected: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  allChecked: boolean;
  onToggleActive: (id: string, active: boolean) => void;
  onSetIndustry: (id: string, industry: string | null) => void;
  onDelete: (id: string) => void;
}) => {
  const reduce = useReducedMotion();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={onToggleAll}
                className="w-4 h-4 accent-[#E3001B] cursor-pointer"
                aria-label="Select all shown"
              />
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Name
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Email
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Industry
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.id}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              // Capped so a fifty-row list does not take two seconds to
              // finish arriving.
              transition={{ duration: 0.18, delay: Math.min(i * 0.012, 0.3) }}
              className="border-b border-line/70 hover:bg-warm/60 transition-colors"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => onToggleRow(r.id)}
                  className="w-4 h-4 accent-[#E3001B] cursor-pointer"
                  aria-label={`Select ${r.name}`}
                />
              </td>
              <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
              <td className="px-4 py-3 text-muted">{r.email}</td>
              {/* A select rather than a label with an edit affordance: 77
                  existing rows have to be assigned, and that has to be 77
                  clicks and no dialogs or it will not happen. The empty option
                  is a real choice — it is how a row goes back to Unassigned. */}
              <td className="px-4 py-3">
                <select
                  value={r.industry ?? ""}
                  onChange={(e) => onSetIndustry(r.id, e.target.value || null)}
                  aria-label={`Industry for ${r.name}`}
                  className={`max-w-[13rem] px-2 py-1 bg-white border border-line rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 transition-colors ${
                    r.industry ? "text-ink" : "text-muted"
                  }`}
                >
                  <option value="">Unassigned</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <Badge tone={r.active ? "active" : "paused"}>
                  {r.active ? "Active" : "Paused"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleActive(r.id, r.active)}
                  >
                    {r.active ? "Pause" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(r.id)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipientsTable;
