#!/usr/bin/env node

import { MongoClient } from "mongodb";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

// ---- Tự động load .env.local của Next.js ----
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([a-zA-Z_]+)=(.*)$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
  console.log("📂 Env loaded from .env.local ✅");
} else {
  console.warn("⚠ .env.local not found, please create it with MONGODB_URI");
}

// ---- Kiểm tra MongoDB URI ----
if (!process.env.MONGODB_URI) {
  console.error("❌ Please add your MongoDB URI to .env.local");
  process.exit(1);
}

// ---- Đọc file Excel từ command line ----
const filePath = process.argv[2];
if (!filePath) {
  console.error("❌ Vui lòng chỉ định file Excel, ví dụ: node importExcel.js sims.xlsx");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error("❌ File Excel không tồn tại:", filePath);
  process.exit(1);
}

// ---- Kết nối MongoDB ----
const client = new MongoClient(process.env.MONGODB_URI);
async function main() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("simpro"); // tên database
    const collection = db.collection("sims"); // tên collection

    // ---- Đọc dữ liệu Excel ----
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`📊 Found ${data.length} rows in Excel`);

    // ---- Chuẩn hóa dữ liệu ----
    const simsToInsert = data.map((row) => ({
      so: String(row.so || ""),
      gia: Number(row.gia || 0),
      nhaMang: String(row.nhaMang || ""),
      loaiSim: String(row.loaiSim || ""),
      tags: Array.isArray(row.tags) ? row.tags : [],
    }));

    // ---- Thêm vào MongoDB, không xóa dữ liệu cũ ----
    const result = await collection.insertMany(simsToInsert);
    console.log(`✅ Inserted ${result.insertedCount} sims`);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
}

main();
