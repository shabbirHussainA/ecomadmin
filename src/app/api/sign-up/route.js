// thsi to signup working
import UserModel from "@/models/UserModel.js";
import dbConnect from "../../../lib/dbCOnnect";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await dbConnect();

  try {
    const { username, email, password, role } = await request.json();

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.role === role) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email and role',
          },
          { status: 400 }
        );
      } else if (existingUserByEmail.role === 'customer' && role === 'admin') {
        return Response.json(
          {
            success: false,
            message: 'A customer cannot create an admin account',
          },
          { status: 400 }
        );
      } else if (existingUserByEmail.role === 'admin' && role === 'customer') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
          username,
          email,
          password: hashedPassword,
          role,
        });

        await newUser.save();

        return Response.json(
          {
            success: true,
            message: 'Customer account created successfully by admin',
          },
          { status: 201 }
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      return Response.json(
        {
          success: true,
          message: 'User registered successfully',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
        error: error.message
      },
      { status: 500 }
    );
  }
}
