// thsi to signup working
import UserModel from "@/models/UserModel.js";
import dbConnect from "../../../lib/dbCOnnect";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await dbConnect();

  try {
    const { username, email, password, role } = await request.json();
    //finding the existing user
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
        );//creating a new acc as the prev user has anoter role 
      } else if (existingUserByEmail.role === 'admin' && role === 'customer') {
        // hasheding password 
        const hashedPassword = await bcrypt.hash(password, 10);
        //creating a new user
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
      // if the user has come new
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
