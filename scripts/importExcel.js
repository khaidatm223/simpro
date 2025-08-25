// scripts/importExcel.js
import xlsx from 'xlsx';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function importExcel(filePath, collectionName) {
  try {
    await client.connect();
    const db = client.db(); // nếu trong URI đã có tên db
    const collection = db.collection(collectionName);

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Chỉ insert các document mới, không xóa dữ liệu cũ
    if (data.length > 0) {
      const result = await collection.insertMany(data);
      console.log(`✅ Đã import ${result.insertedCount} sim vào collection "${collectionName}"`);
    } else {
      console.log("⚠️ Không có dữ liệu trong file Excel");
    }
  } catch (err) {
    console.error("❌ Lỗi import:", err);
  } finally {
    await client.close();
  }
}

// Thay đổi đường dẫn file và collection name khi cần
const filePath = './data/sims.xlsx';
const collectionName = 'sims';

importExcel(filePath, collectionName);
