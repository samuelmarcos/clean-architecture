
import { RequiredFieldValidation } from '../../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../../validation/validators/validation-composite'
import { makeAddSurveyValidation } from './add-survey-validation-factory'


jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
    test('should call validatio composite with all validations', () => {
        makeAddSurveyValidation()
        const validations : Validation[] = []
        for(const field of ['question', 'answers']) {
            validations.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})