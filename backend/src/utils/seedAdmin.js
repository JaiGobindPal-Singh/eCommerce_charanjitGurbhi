import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import User from '../models/user.model.js';

export const seedAdminUser = async() =>{
    try{
        const existingAdmin = await User.findOne({phone: env.adminPhone, role: 'admin' });
        if(existingAdmin){
            return;
        }
        //create admin user if not exists
        await User.create({
            name: env.adminName,
            phone: env.adminPhone,
            password: await bcrypt.hash(env.adminPassword, 10),
            role: 'admin'
        })
        console.log('Admin user seeded successfully.');
    }catch(error){
        console.error('Error seeding admin user:', error.message);
    }
}