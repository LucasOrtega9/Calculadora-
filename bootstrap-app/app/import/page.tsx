import { CheckCircle2, FileWarning, Upload } from "lucide-react";
import { createManualBudgetLineAction, importBudgetAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getBudgetLineOptions, getBudgetYears } from "@/lib/budget-lines";
import { getExcelImportPreview } from "@/lib/excel-import";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ImportPage({ searchParams }: Props) {
  const params = searchParams ? await Promise.resolve(searchParams) : {};
  const imported = firstParam(params.imported);
  const lines = firstParam(params.lines);
  const allocations = firstParam(params.allocations);
  const year = firstParam(params.year);
  const manual = firstParam(params.manual);

  const preview = getExcelImportPreview();
  const [lineOptions, years] = await Promise.all([getBudgetLineOptions(), getBudgetYears()]);
  const defaultYear = years.includes(2026)
    ? 2026
    : years[0] ?? new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Importar orçamento</h2>
        <p className="text-sm text-zinc-500">
          Carregue o baseline do arquivo Excel e mantenha linhas extras manuais.
        </p>
      </div>

      {imported ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Importação concluída: ano {year}, {lines} linhas processadas e {allocations} alocações atualizadas.
        </div>
      ) : null}

      {manual ? (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <CheckCircle2 className="h-4 w-4" />
          Linha manual criada com sucesso.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Arquivo Pasta2.xlsx</CardTitle>
          <CardDescription>
            Leitura da planilha Planilha1 com colunas BRL&rsquo;000, YYYY-E, Enforce, DA e IP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preview.found ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
              <p>
                <strong>Arquivo:</strong> {preview.filePath}
              </p>
              <p>
                <strong>Ano detectado:</strong> {preview.detectedYear}
              </p>
              <p>
                <strong>Coluna do ano:</strong> {preview.yearColumn}
              </p>
              <p>
                <strong>Linhas com nome:</strong> {preview.lineCount}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <FileWarning className="h-4 w-4" />
              Arquivo não encontrado em <code>./Pasta2.xlsx</code> nem <code>../Pasta2.xlsx</code>.
            </div>
          )}

          <form action={importBudgetAction}>
            <input type="hidden" name="path" value={preview.filePath ?? ""} />
            <Button type="submit" disabled={!preview.found}>
              <Upload className="mr-2 h-4 w-4" />
              Importar/Atualizar do Pasta2.xlsx
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar linha manual</CardTitle>
          <CardDescription>
            Linhas manuais não são apagadas durante importações futuras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createManualBudgetLineAction} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1.5 xl:col-span-3">
              <Label htmlFor="name">Nome da linha</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type">Tipo</Label>
              <Select id="type" name="type" defaultValue="OPEX">
                <option value="OPEX">OPEX</option>
                <option value="CAPEX">CAPEX</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="parentId">Linha pai (opcional)</Label>
              <Select id="parentId" name="parentId" defaultValue="">
                <option value="">Sem pai</option>
                {lineOptions.map((line) => (
                  <option key={line.id} value={line.id}>
                    {"-".repeat(line.depth)} [{line.type}] {line.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="year">Ano</Label>
              <Input id="year" name="year" type="number" defaultValue={defaultYear} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amountEnforce">Orçado Enforce (R$)</Label>
              <Input id="amountEnforce" name="amountEnforce" type="number" defaultValue="0" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amountDa">Orçado DA (R$)</Label>
              <Input id="amountDa" name="amountDa" type="number" defaultValue="0" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amountIp">Orçado IP (R$)</Label>
              <Input id="amountIp" name="amountIp" type="number" defaultValue="0" />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-zinc-700 xl:col-span-3">
              <input type="checkbox" name="isGroup" value="true" />
              Marcar como grupo/seção
            </label>

            <div className="xl:col-span-3">
              <Button type="submit">Criar linha manual</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
