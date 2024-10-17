import { Request, Response, NextFunction } from "express";
import { IDatingUseCase } from "../../application/usecase/DatingUseCase";
import { HttpStatus } from "../../utils/HttpStatus";

export class DatingController {
    private _datingUseCase: IDatingUseCase;

    constructor(_datingUseCase: IDatingUseCase) {
        this._datingUseCase = _datingUseCase;
    }

    async swipeProfile(req: Request, res: Response, next: NextFunction) {
        console.log("swipe profile", req.body);

        try {
            const { userId, maximumAge, interestedGender } = req.body;

            const profiles = await this._datingUseCase.swipeProfiles(userId, maximumAge, interestedGender);
            if (!profiles) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching profiles" });
            }
            res.json({ profiles });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching profiles" });
        }
    }
    async updateDatingProfileImages(req: Request, res: Response, next: NextFunction) {
        console.log("update dating profile images", req.body);

        try {
            const { userId, url } = req.body;

            await this._datingUseCase.updateProfileImages(userId, url);
            res.json({});
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating profile images" });
        }
    }
    async fetchMatches(req: Request, res: Response, next: NextFunction) {
        console.log("fetch matches");

        try {
            const { userId } = req.body;
            const matches = await this._datingUseCase.fetchMatches(userId);
            res.json({ matches });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching matches" });
        }
    }
    async getUserDatingProfile(req: Request, res: Response, next: NextFunction) {
        console.log("get profile", req.body);

        try {
            const { userId } = req.body;
            const user = await this._datingUseCase.getUserDatingProfile(userId);
            res.json({ user });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the profile" });
        }
    }
    async handleDatingTab1(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, formData } = req.body;
            console.log(req.body);
            
            const result = await this._datingUseCase.handleDatingTab1(userId, formData);
            res.json(result);
        } catch (error) {
            console.error("Error handling dating profile:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while processing your request." });
        }
    }
    async handleDatingTab3(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const images = await this._datingUseCase.getProfileImages(userId);

            if (!images) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
            }

            res.json({ images });
        } catch (error) {
            console.error("Error fetching user images:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching user images." });
        }
    }
    async handleDatingTab4(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, maximumAge, profileVisibility, interestedGender } = req.body;
            console.log(req.body, "ooo");


            const updatedUser = await this._datingUseCase.updateUserPreferences(userId, maximumAge, profileVisibility, interestedGender);

            if (!updatedUser) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
            }

            res.json(updatedUser);
        } catch (error) {
            console.error("Error updating user preferences:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating user preferences." });
        }
    }
    async handleUserSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            // console.log(userId);

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const userSettings = await this._datingUseCase.getUserSettings(userId);

            if (!userSettings) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
            }

            res.status(200).json({ data: userSettings });
        } catch (error) {
            console.error("Error fetching user settings:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }
    async getDatingTab1Details(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            console.log(userId, "lop");

            if (!userId) {
                return res.status(400).json({ error: "User ID is required" });
            }

            const formData = await this._datingUseCase.getDatingTab1Details(userId);

            if (!formData) {
                return res.status(200).json({ formData })
                // return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
            }

            return res.status(200).json({ formData });
        } catch (error) {
            console.error("Error fetching dating tab 1 details:", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }

}