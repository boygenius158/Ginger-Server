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
const StoryModel_1 = __importDefault(require("../../database/model/StoryModel"));
function deleteExpireStoriesTask() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running story cleaner");
        try {
            const now = new Date();
            const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const result = yield StoryModel_1.default.deleteMany({
                createdAt: { $lt: cutoff }
            });
            console.log(`${result.deletedCount} stories deleted.`);
        }
        catch (error) {
            console.error("Error while deleting expired stories:", error);
        }
    });
}
exports.default = deleteExpireStoriesTask;
