export class BurgosAgency {

    private static agencyName: string;
    private static manager: string;

    static getAgencyName(): string {
        return BurgosAgency.agencyName;
    }

    static setAngencyName(name: string): void {
        BurgosAgency.agencyName = name;
    }

    static getManager(): string{
        return BurgosAgency.manager;
    }

    static setManager(name: string): void {
        BurgosAgency.manager = name;
    }
}