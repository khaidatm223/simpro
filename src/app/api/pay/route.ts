import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { simId, name, phone, zalo } = body;

    // Gửi Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = `💳 KHÁCH THANH TOÁN SIM\n\n📱 Số: ${simId}\n👤 Tên: ${name}\n📞 Phone: ${phone}\n💬 Zalo: ${zalo}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    return NextResponse.json({ success: true, message: "Đã gửi yêu cầu thanh toán, chúng tÔi sẽ liên lạc lại bạn" });
  } catch (error) {
    console.error("Pay error:", error);
    return NextResponse.json({ success: false, message: "Lỗi server" }, { status: 500 });
  }
}
