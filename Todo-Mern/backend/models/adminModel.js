import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    }
}, {
    timestamps: true
});

// Create default admin if none exists
adminSchema.statics.createDefaultAdmin = async function() {
    try {
        const adminCount = await this.countDocuments();
        
        if (adminCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            await this.create({
                name: 'Super Admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'superadmin'
            });
            
            console.log('Default admin account created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

// Reset superadmin password
adminSchema.statics.resetSuperAdminPassword = async function(newPassword) {
    try {
        // Find superadmin account
        const superAdmin = await this.findOne({ role: 'superadmin' });
        
        if (!superAdmin) {
            throw new Error('Super admin account not found');
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password
        superAdmin.password = hashedPassword;
        await superAdmin.save();
        
        return { success: true, message: 'Super admin password reset successfully' };
    } catch (error) {
        console.error('Error resetting super admin password:', error);
        return { success: false, message: error.message };
    }
};

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel; 