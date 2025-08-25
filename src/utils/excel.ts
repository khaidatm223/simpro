// src/utils/excel.ts
import * as XLSX from "xlsx";

export async function readExcel(file: File): Promise<any[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  // defval: '' -> thay bằng chuỗi rỗng nếu cell trống
  const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  return json as any[];
}
