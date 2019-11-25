export class ExistObject extends Error {

    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ExistObject.prototype);
    }

}
