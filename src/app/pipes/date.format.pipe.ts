import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toDateFormat',
    standalone: true
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string | Date | null): string {
        if (!value) return '';

        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleDateString('en-GB');  // "DD/MM/YYYY" 
    }
}
