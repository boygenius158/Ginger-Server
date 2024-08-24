import { IAdminRepository } from "../interface/IAdminRepository";
import { IAdminUseCase } from "../interface/IAdminUseCase";

export class AdminUseCase implements IAdminUseCase {
    private repository: IAdminRepository
    constructor(repository: IAdminRepository) {
        this.repository = repository
    }
    // async fetchBarChart(): Promise<BarChartData> {
        
    // }
} 