import { AddSurveyRepository , AddSurveyModel, AddSurvey} from './db-add-survey-protocols'


export class DbAddSurvey implements AddSurvey {

    constructor(private readonly addSurveyRepository: AddSurveyRepository ) {}
    
    public async add(data: AddSurveyModel): Promise<void> {
       await this.addSurveyRepository.add(data)
    }
}