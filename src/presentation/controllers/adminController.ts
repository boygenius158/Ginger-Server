import { NextFunction, Request, Response } from "express";
import { IAdminUseCase } from "../../application/interface/IAdminUseCase";

export class AdminController {
    private adminUseCase: IAdminUseCase

    constructor(adminUseCase: IAdminUseCase) {
        this.adminUseCase = adminUseCase
    }

    // async fetchBarChart(req:Request,res:Response,next:NextFunction){
    //     try {
    //         const fetchData = await this.adminUseCase
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }
}