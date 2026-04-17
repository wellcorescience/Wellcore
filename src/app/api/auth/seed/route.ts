import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    let user = await User.findOne({ email: "admin@wellcore.science" });
    
    if (!user) {
      user = await User.create({ 
        name: "Admin Commander", 
        email: "admin@wellcore.science", 
        password: hashedPassword, 
        role: "admin" 
      });
      return NextResponse.json({ success: true, message: "Admin created", email: "admin@wellcore.science", password: "admin123" });
    } else {
      user.password = hashedPassword;
      user.role = "admin";
      await user.save();
      return NextResponse.json({ success: true, message: "Admin updated", email: "admin@wellcore.science", password: "admin123" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
