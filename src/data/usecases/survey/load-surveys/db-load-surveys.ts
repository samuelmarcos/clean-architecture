import { SurveyModel, LoadSurveys, LoadSurveysRepository } from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveys {

    constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

    public async load(): Promise<SurveyModel[]> {
        const surveys = await this.loadSurveysRepository.loadAll()
        return surveys
    }
}