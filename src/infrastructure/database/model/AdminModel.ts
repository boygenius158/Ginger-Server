import mongoose, { Document, Schema } from 'mongoose';

interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  roles: string; 
  createdAt: Date;
  updatedAt: Date;
}

// Create the admin schema
const AdminSchema: Schema = new Schema(
  {
    // username: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    // },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      enum: ['superadmin', 'admin'], // You can customize the roles as needed
      default: 'admin',
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model
const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default AdminModel;
