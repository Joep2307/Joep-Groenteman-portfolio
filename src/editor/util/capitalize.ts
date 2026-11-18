/** Text with its first letter in upper case: "skills row", "Skills row". */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
