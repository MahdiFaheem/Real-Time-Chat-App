export class UserModel {

    constructor(id: number, email: string, firstName: string, lastName: string) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    id: number;
    email: string;
    firstName: string;
    lastName: string;
}