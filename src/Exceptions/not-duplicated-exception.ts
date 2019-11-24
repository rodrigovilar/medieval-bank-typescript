export class NotDuplicatedException extends Error {

    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotDuplicatedException.prototype);
    }
}
