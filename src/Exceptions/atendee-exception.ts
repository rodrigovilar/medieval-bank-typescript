export class AtendeeException extends Error {

    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AtendeeException.prototype);
    }

}
