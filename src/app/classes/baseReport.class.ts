class BaseReport {

    formatDate(isoDate: string): string {

        // Handle empty date strings
        if (isoDate.trim().length == 0) { return isoDate; }

        // Return the formatted date
        else {
            let i = new Date(isoDate);
            return (i.getMonth() + 1) + '/' + i.getDate() + '/' + i.getFullYear();
        }
    }
}

export { BaseReport }