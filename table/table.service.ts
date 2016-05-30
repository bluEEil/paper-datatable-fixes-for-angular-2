/**
 * Created by Liran on 05/05/2016.
 */
import {Injectable} from "angular2/core";
import {TableComponent} from "./table.component";

interface TableInService {
    id: string;
    table: TableComponent;
}

@Injectable()
export class TableService {
    private listTables: TableInService[];

    constructor() {
        this.listTables = [];
    }

    public addTable(tableId: string, table: TableComponent): void {

        if (this.listTables[tableId] !== undefined) {
            throw new Error("Duplicate id in service table");
        }

        this.listTables.push({
            id: tableId,
            table: table
        });
    }

    public get(tableId: string): any {
        let returnTable: any = null;
        this.listTables.forEach((tableInService: TableInService) => {
            if (tableInService.id === tableId) {
                returnTable = tableInService.table.getTableElement();
            }
        });

        return returnTable;
    }

    public getTableComponent(tableId: string): any {
        let returnTable: any = null;
        this.listTables.forEach((tableInService: TableInService) => {
            if (tableInService.id === tableId) {
                returnTable = tableInService.table;
            }
        });

        return returnTable;
    }

    public remove(tableId: string): void {
        let found: boolean = false;
        let index: number;
        for (index = 0; index < this.listTables.length; index++) {
            if (this.listTables[index].id === tableId) {
                found = true;

                break;
            }
        }

        if (found) {
            this.listTables.splice(index, 1);
        }
    }
}
