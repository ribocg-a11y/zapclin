/**
 * Cria/atualiza aba INVESTIMENTO na ZapClin_Sistema_Gerenciamento.
 * Uso: node scripts/criar-aba-investimento-zapclin.js [--dry-run]
 */
import { google } from "googleapis";
import { loadAuth } from "./load-auth.js";

const SHEET_ID = "1nL694BR_tkO5iHYHMoTpIelyMqXtktjIa87mWFeGmug";
const SHEET_NAME = "INVESTIMENTO";
const HEADER_ROW = 9;
const DATA_ROW = 11;
const dryRun = process.argv.includes("--dry-run");

const ITENS = [
  ["1.1", "Equipamentos", "Máquina de lavagem / higienização", "S", ""],
  ["1.2", "Equipamentos", "Máquina de secagem / centrifuga", "S", ""],
  ["1.3", "Equipamentos", "Compressor / equipamento de ar", "S", ""],
  ["1.4", "Equipamentos", "Bancada de trabalho", "S", ""],
  ["1.5", "Equipamentos", "Kit de escovas e ferramentas", "S", ""],
  ["1.6", "Equipamentos", "Estantes / organização", "S", ""],
  ["1.7", "Equipamentos", "Outro equipamento (descreva na observação)", "S", ""],
  ["2.1", "Loja", "Montagem / adequação do ponto", "S", ""],
  ["2.2", "Loja", "Identidade visual (logo, fachada, adesivos)", "S", ""],
  ["2.3", "Loja", "Mobiliário (mesas, cadeiras, balcão)", "S", ""],
  ["2.4", "Loja", "Iluminação", "S", ""],
  ["2.5", "Loja", "Caução / depósito locador (se não devolvido)", "S", ""],
  ["2.6", "Loja", "Taxa de entrada / setup do ponto", "S", ""],
  ["2.7", "Loja", "Alvará / licenças iniciais (parte única)", "S", ""],
  ["2.8", "Loja", "Outro (loja)", "S", ""],
  ["3.1", "Insumos", "Estoque inicial de produtos químicos", "S", ""],
  ["3.2", "Insumos", "Embalagens / sacos / etiquetas", "S", ""],
  ["3.3", "Insumos", "Material de limpeza inicial", "S", ""],
  ["3.4", "Insumos", "Outro (insumos)", "S", ""],
  ["4.1", "Tecnologia", "Sistema / software / implantação", "S", ""],
  ["4.2", "Tecnologia", "Tablet / celular operacional", "S", ""],
  ["4.3", "Tecnologia", "Impressora / etiquetas", "S", ""],
  ["4.4", "Tecnologia", "Roteador / rede", "S", ""],
  ["4.5", "Tecnologia", "Outro (tecnologia)", "S", ""],
  ["5.1", "Abertura", "Marketing de inauguração (campanha única)", "S", ""],
  ["5.2", "Abertura", "Jurídico / contábil abertura", "S", ""],
  ["5.3", "Abertura", "Transporte / frete de equipamentos", "S", ""],
  ["5.4", "Abertura", "Uniformes / EPI inicial", "S", ""],
  ["5.5", "Abertura", "Capital de giro (caixa reserva)", "N", "Marque S só se quiser no payback"],
  ["5.6", "Abertura", "Outro (abertura)", "S", ""],
];

const auth = await loadAuth();
const sheets = google.sheets({ version: "v4", auth });

const meta = await sheets.spreadsheets.get({
  spreadsheetId: SHEET_ID,
  fields: "sheets.properties(sheetId,title)",
});
let sheetIdMap = Object.fromEntries(
  (meta.data.sheets || []).map((s) => [s.properties.title, s.properties.sheetId])
);

if (!sheetIdMap[SHEET_NAME]) {
  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, acao: "criar_aba", nome: SHEET_NAME }, null, 2));
    process.exit(0);
  }
  const add = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: SHEET_NAME,
              gridProperties: { rowCount: 120, columnCount: 8 },
              tabColor: { red: 0.15, green: 0.55, blue: 0.35 },
            },
          },
        },
      ],
    },
  });
  const newId = add.data.replies[0].addSheet.properties.sheetId;
  sheetIdMap[SHEET_NAME] = newId;
}

const lastDataRow = DATA_ROW + ITENS.length - 1;

const values = [
  { range: `${SHEET_NAME}!A1`, values: [["ZAPCLIN — Investimento inicial (Payback)"]] },
  {
    range: `${SHEET_NAME}!A2`,
    values: [["Preencha a coluna D (Valor R$). Entra?= S entra no total | N ignora. Dashboard financeiro lê esta aba."]],
  },
  { range: `${SHEET_NAME}!A3`, values: [["Data de inauguração", "01/04/2026"]] },
  { range: `${SHEET_NAME}!A4`, values: [["Mês início payback (mm/aaaa)", "04/2026"]] },
  {
    range: `${SHEET_NAME}!A6`,
    values: [["INVESTIMENTO TOTAL (I)", `=SOMASES(D${DATA_ROW}:D${lastDataRow};E${DATA_ROW}:E${lastDataRow};"S")`]],
  },
  {
    range: `${SHEET_NAME}!A${HEADER_ROW}:F${HEADER_ROW}`,
    values: [["#", "Categoria", "Item", "Valor (R$)", "Entra?", "Observação"]],
  },
  {
    range: `${SHEET_NAME}!A10`,
    values: [["← Preencha os valores na coluna D. Não apague as linhas de item."]],
  },
];

const dataRows = ITENS.map((row) => [row[0], row[1], row[2], "", row[3], row[4]]);
values.push({
  range: `${SHEET_NAME}!A${DATA_ROW}:F${lastDataRow}`,
  values: dataRows,
});

const sumBase = `D$${DATA_ROW}:D$${lastDataRow}`;
const entBase = `E$${DATA_ROW}:E$${lastDataRow}`;
const catBase = `B$${DATA_ROW}:B$${lastDataRow}`;
const subRow = lastDataRow + 2;
const CATS = ["Equipamentos", "Loja", "Insumos", "Tecnologia", "Abertura"];
values.push({ range: `${SHEET_NAME}!A${subRow}`, values: [["Subtotais por categoria"]] });
CATS.forEach((cat, i) => {
  values.push({
    range: `${SHEET_NAME}!A${subRow + 1 + i}`,
    values: [[cat, `=SOMASES(${sumBase};${catBase};"${cat}";${entBase};"S")`]],
  });
});

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, sheet: SHEET_NAME, itens: ITENS.length, values: values.length }, null, 2));
  process.exit(0);
}

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: SHEET_ID,
  requestBody: { valueInputOption: "USER_ENTERED", data: values },
});

const sid = sheetIdMap[SHEET_NAME];
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: SHEET_ID,
  requestBody: {
    requests: [
      {
        updateSheetProperties: {
          properties: { sheetId: sid, gridProperties: { frozenRowCount: HEADER_ROW } },
          fields: "gridProperties.frozenRowCount",
        },
      },
      {
        repeatCell: {
          range: { sheetId: sid, startRowIndex: HEADER_ROW - 1, endRowIndex: HEADER_ROW, startColumnIndex: 0, endColumnIndex: 6 },
          cell: {
            userEnteredFormat: {
              textFormat: { bold: true },
              backgroundColor: { red: 0.9, green: 0.97, blue: 0.93 },
            },
          },
          fields: "userEnteredFormat(textFormat,backgroundColor)",
        },
      },
      {
        repeatCell: {
          range: { sheetId: sid, startRowIndex: 5, endRowIndex: 6, startColumnIndex: 0, endColumnIndex: 2 },
          cell: {
            userEnteredFormat: {
              textFormat: { bold: true },
              backgroundColor: { red: 1, green: 0.95, blue: 0.8 },
            },
          },
          fields: "userEnteredFormat(textFormat,backgroundColor)",
        },
      },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: "COLUMNS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 52 }, fields: "pixelSize" } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: "COLUMNS", startIndex: 1, endIndex: 2 }, properties: { pixelSize: 110 }, fields: "pixelSize" } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: "COLUMNS", startIndex: 2, endIndex: 3 }, properties: { pixelSize: 340 }, fields: "pixelSize" } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: "COLUMNS", startIndex: 3, endIndex: 4 }, properties: { pixelSize: 110 }, fields: "pixelSize" } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: "COLUMNS", startIndex: 4, endIndex: 5 }, properties: { pixelSize: 64 }, fields: "pixelSize" } },
      { updateDimensionProperties: { range: { sheetId: sid, dimension: "COLUMNS", startIndex: 5, endIndex: 6 }, properties: { pixelSize: 220 }, fields: "pixelSize" } },
    ],
  },
});

const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=${sid}`;
console.log(JSON.stringify({ ok: true, sheet: SHEET_NAME, itens: ITENS.length, url }, null, 2));
