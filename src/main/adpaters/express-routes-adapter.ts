import { Controller, HttpRequest } from "../../presentation/protocols";
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {

        const httpRequest: HttpRequest = {
            body: req.body
        }

        const httpResponse = controller.handle(httpRequest)

        if ((await httpResponse).statusCode === 200) {
            res.status((await httpResponse).statusCode).json((await httpResponse).body)
        } else {
            res.status((await httpResponse).statusCode).json({
                error: (await httpResponse).body.message
            })
        }
    }
}