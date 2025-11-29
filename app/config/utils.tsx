export function isReleased(dateString: string): boolean {
    // if blank → false
    if (!dateString || dateString.trim() === "") {
        return false;
    }

    // parse date
    const date = new Date(dateString);

    // invalid date → false
    if (isNaN(date.getTime())) {
        return false;
    }

    // today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // date < today → false
    if (date < today) {
        return false;
    }

    // otherwise → true
    return true;
}
