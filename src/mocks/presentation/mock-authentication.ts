import { AthenticationParams, Authentication } from "@/domain/usecases/account/authenctication"

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
      async auth(authentication: AthenticationParams): Promise<string> {
          return new Promise(resolve => resolve('any_token'))
      }
  }

  return new AuthenticationStub()
}