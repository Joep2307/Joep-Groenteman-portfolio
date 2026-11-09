/** The side navigation's link to a new section. */
export function railItemHtml(id: string): string {
    return (
        `<a class="rail-item" href="#${id}" data-target="${id}">` +
        '<span class="label">New section</span></a>'
    );
}
