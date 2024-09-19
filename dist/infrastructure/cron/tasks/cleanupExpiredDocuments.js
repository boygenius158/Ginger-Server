"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PremiumModel_1 = require("../../database/model/PremiumModel");
const UserModel_1 = __importDefault(require("../../database/model/UserModel"));
function deletePremiumDoc() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("delete premium/task");
        try {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            // Find and delete documents older than one year
            const oldPremiumDocs = yield PremiumModel_1.PremiumModel.find({ createdAt: { $lt: oneYearAgo } });
            const result = yield PremiumModel_1.PremiumModel.deleteMany({ createdAt: { $lt: oneYearAgo } });
            console.log(`Deleted ${result.deletedCount} old Premium documents.`);
            // Extract user IDs from deleted Premium documents
            const userIds = oldPremiumDocs.map(doc => doc.userId);
            if (userIds.length > 0) {
                // Update the s of users associated with deleted Premium documents
                const updateResult = yield UserModel_1.default.updateMany({ _id: { $in: userIds } }, { $set: { roles: 'user' } } // Set the s to 'user'
                );
                // console.log(`Updated s for ${updateResult.nModified} users.`);
            }
            else {
                console.log("No users found to update.");
            }
        }
        catch (error) {
            console.error('Error occurred while deleting old Premium documents or updating users:', error);
        }
    });
}
// Export the function
exports.default = deletePremiumDoc;
