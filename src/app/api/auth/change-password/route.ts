import { NextResponse } from "next/server";
import { AuthStore } from "@/lib/authStore";

export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();

  if (oldPassword !== AuthStore.password) {
    return NextResponse.json(
      { success: false, message: "Sai mật khẩu cũ!" },
      { status: 400 }
    );
  }

  AuthStore.password = newPassword;
  return NextResponse.json({ success: true, message: "Đổi mật khẩu thành công!" });
}
