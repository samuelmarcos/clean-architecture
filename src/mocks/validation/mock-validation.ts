import { Validation } from "@/presentation/protocols"

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
      validate(input: string): any {
           return null
      }
  }
  return new ValidationStub()
}