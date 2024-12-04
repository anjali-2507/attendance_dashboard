import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

import { sendOtpOnWhatsapp } from '@/lib/send-otp-on-whatsapp';

import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  let mongoClient;
  try {
    const body = await req.json();
    const phone = body?.phone;

    // Hash the OTP
    const otp = crypto.randomInt(100000, 999999);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    // Store the hashed OTP in the database along with the phone number and expiry time
    mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();
    const otps = mongoClient.db(process.env.DB_NAME).collection('otps');

    await otps.insertOne({
      phone,
      otp: hashedOtp,
      expiry: Date.now() + 3 * 60 * 1000,
    });
    await mongoClient.close();

    // const otpRes = await sendOtpOnWhatsapp(otp, phone);
console.log( otp);
    return NextResponse.json(
      { status: true },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Could not send OTP' },
      {
        status: 500,
      }
    );
  } finally {
    mongoClient?.close();
  }
}
