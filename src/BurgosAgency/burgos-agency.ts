export class BurgosAgency {
    private static agencyName: string;
    private static manager: string;

    static GetName(): string {
        return BurgosAgency.agencyName;
    }

    static SetName(name: string): void {
        BurgosAgency.agencyName = name;
    }

    static GetManager(): string{
        return BurgosAgency.manager;
    }

    static SetManager(name: string): void {
        BurgosAgency.manager = name;
    }
}
