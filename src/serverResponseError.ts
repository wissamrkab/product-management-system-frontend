import {ResponseError} from "@/interfaces/serverResponse";

export class ServerResponseError extends Error {
    public errors: ResponseError[];

    constructor(errors: ResponseError[]) {
        super("Bad Request");
        this.name = "ServerResponseErrors";
        this.errors = errors;
    }
}
