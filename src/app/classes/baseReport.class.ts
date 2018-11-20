class BaseReport {

    formatDate(isoDate: string): string {
        let i = new Date(isoDate);

        return (i.getMonth() + 1) + '/' + i.getDate() + '/' + i.getFullYear();
    }
}

export { BaseReport }