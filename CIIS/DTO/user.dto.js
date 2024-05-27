class UserDTO {
    constructor(name, lastname, email, dni, phone, career, studycenter) {
        this.name_user = name;
        this.lastname_user = lastname
        this.email_user = email;
        this.dni_user = dni;
        this.phone_user = phone;
        this.university_career_user = career
        this.study_center_user = studycenter;
    }
    /**
     * @param {string} code
     */
    set code(code) {
        this.code_user = code;
    }

    /**
     * @param {any} _password
     */
    set password(_password) {
        this.password_user = _password;
    }
    /**
     * @param {string} role
     */
    set role(role) {
        this.role_id = role;
    }

    get view() {
        return {
            name: this.name_user,
            lastname: this.lastname_user,
            email: this.email_user,
            phone: this.phone_user
        }
    }
}

module.exports = UserDTO;