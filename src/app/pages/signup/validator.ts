import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {

    return (form: AbstractControl): ValidationErrors | null => {
        const passwordControl = form.get('password');
        const confirmPasswordControl = form.get('confirmPassword');

        if (!passwordControl || !confirmPasswordControl) return null;

        const passwordsMatch = passwordControl.value === confirmPasswordControl.value;

        if (!passwordsMatch) {
            confirmPasswordControl.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            confirmPasswordControl.setErrors(null);
            return null;
        }
    };
}
