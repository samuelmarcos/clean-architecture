import { Controller, HttpRequest, HttpResponse, LoadSurveys } from "./load-surveys-controller-protocols";

export class LoadSurveysController implements Controller {

    constructor(private readonly loadSurveys: LoadSurveys) {}

    public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        
        await this.loadSurveys.load()
        return null
    }
}