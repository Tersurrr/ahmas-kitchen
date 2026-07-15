"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/whatsapp";
import { Search, Download, Trash2, X } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<OrderRecord | null>(null);

  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    setOrders((data as unknown as OrderRecord[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search);
      const matchesDate = !dateFilter || o.created_at.startsWith(dateFilter);
      return matchesSearch && matchesDate;
    });
  }, [orders, search, dateFilter]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this order record?")) return;
    const previous = orders;
    setOrders((os) => os.filter((o) => o.id !== id));
    setSelected(null);
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      setOrders(previous);
      alert("Couldn't delete this order. Please try again.");
    }
  }

  function exportCSV() {
    const header = ["Customer", "Phone", "Address", "Type", "Items", "Total", "Date"];
    const rows = filtered.map((o) => [
      o.customer_name,
      o.phone,
      o.address || "",
      o.fulfillment_type,
      (o.order_items || []).map((i) => `${i.quantity}x ${i.name}`).join("; "),
      o.total_price,
      new Date(o.created_at).toLocaleString(),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amahs-kitchen-orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">Order History</h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full rounded-lg border border-outline-variant bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-outline-variant bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-x-auto">
        {loading ? (
          <p className="p-5 text-sm text-on-surface-variant">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-5 text-sm text-on-surface-variant">No orders found.</p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-on-surface-variant border-b border-outline-variant/20">
                <th className="py-3 px-4 font-medium">Customer</th>
                <th className="py-3 px-4 font-medium">Phone</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Total</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="border-b border-outline-variant/10 hover:bg-surface-container-low cursor-pointer"
                >
                  <td className="py-3 px-4">{o.customer_name}</td>
                  <td className="py-3 px-4">{o.phone}</td>
                  <td className="py-3 px-4 capitalize">{o.fulfillment_type}</td>
                  <td className="py-3 px-4">{formatCurrency(o.total_price)}</td>
                  <td className="py-3 px-4">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(o.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-primary">Order Details</h2>
              <button onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-on-surface-variant">Customer:</span> {selected.customer_name}</p>
              <p><span className="text-on-surface-variant">Phone:</span> {selected.phone}</p>
              {selected.address && <p><span className="text-on-surface-variant">Address:</span> {selected.address}</p>}
              <p><span className="text-on-surface-variant">Fulfillment:</span> <span className="capitalize">{selected.fulfillment_type}</span></p>
              {selected.preferred_date && <p><span className="text-on-surface-variant">Preferred Date:</span> {selected.preferred_date}</p>}
              {selected.preferred_time && <p><span className="text-on-surface-variant">Preferred Time:</span> {selected.preferred_time}</p>}
              {selected.special_instructions && (
                <p><span className="text-on-surface-variant">Notes:</span> {selected.special_instructions}</p>
              )}
              <div className="pt-3 border-t border-outline-variant/20 mt-3">
                <p className="text-on-surface-variant mb-1.5">Items:</p>
                {(selected.order_items || []).map((i) => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.quantity} x {i.name}</span>
                    <span>{formatCurrency(i.unit_price * i.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 mt-2 border-t border-outline-variant/20">
                  <span>Total</span>
                  <span>{formatCurrency(selected.total_price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
