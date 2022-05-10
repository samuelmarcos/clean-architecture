import { Controller, HttpRequest } from "../../../presentation/protocols";
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {

        const httpRequest: HttpRequest = {
            body: req.body
        }

        const httpResponse = await controller.handle(httpRequest)

        if (httpResponse.statusCode >= 200 || httpResponse.statusCode <= 299) {
            res.status((await httpResponse).statusCode).json((await httpResponse).body)
        } else {
            res.status((await httpResponse).statusCode).json({
                error: (await httpResponse).body.message
            })
        }
    }
}