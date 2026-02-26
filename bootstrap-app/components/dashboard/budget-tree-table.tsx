"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type BudgetTreeNode } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/utils";

type Props = {
  tree: BudgetTreeNode[];
};

function collectOpenIds(nodes: BudgetTreeNode[]) {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.children.length > 0) {
      ids.push(node.id);
      ids.push(...collectOpenIds(node.children));
    }
  }
  return ids;
}

export function BudgetTreeTable({ tree }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(collectOpenIds(tree).slice(0, 12)),
  );

  const rows = useMemo(() => {
    const flattened: Array<{ node: BudgetTreeNode; visible: boolean }> = [];

    const walk = (nodes: BudgetTreeNode[], parentVisible: boolean) => {
      for (const node of nodes) {
        flattened.push({ node, visible: parentVisible });
        const isExpanded = expanded.has(node.id);
        if (node.children.length > 0) {
          walk(node.children, parentVisible && isExpanded);
        }
      }
    };

    walk(tree, true);
    return flattened.filter((row) => row.visible);
  }, [expanded, tree]);

  const toggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linhas de orçamento (visão hierárquica)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Linha</TableHead>
              <TableHead className="text-right">Orçado</TableHead>
              <TableHead className="text-right">YTD (consumido)</TableHead>
              <TableHead className="text-right">Realizado</TableHead>
              <TableHead className="text-right">Δ (Realizado - Orçado)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ node }) => {
              const isExpanded = expanded.has(node.id);
              const hasChildren = node.children.length > 0;

              return (
                <TableRow key={node.id}>
                  <TableCell>
                    <div
                      className="flex items-center gap-2"
                      style={{ paddingLeft: `${node.depth * 14}px` }}
                    >
                      {hasChildren ? (
                        <button
                          className="rounded p-0.5 hover:bg-zinc-100"
                          onClick={() => toggle(node.id)}
                          type="button"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-zinc-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-zinc-500" />
                          )}
                        </button>
                      ) : (
                        <span className="inline-block w-5" />
                      )}

                      <span className={node.isGroup ? "font-semibold text-zinc-900" : ""}>
                        {node.name}
                      </span>
                      <Badge variant={node.type === "CAPEX" ? "info" : "neutral"}>
                        {node.type}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="text-right number-tabular">
                    {formatCurrency(node.metrics.plannedYtd)}
                  </TableCell>
                  <TableCell className="text-right number-tabular">
                    {formatCurrency(node.metrics.consumedYtd)}
                  </TableCell>
                  <TableCell className="text-right number-tabular">
                    {formatCurrency(node.metrics.realizedYtd)}
                  </TableCell>
                  <TableCell
                    className={`text-right number-tabular ${
                      node.metrics.delta > 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {formatCurrency(node.metrics.delta)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
