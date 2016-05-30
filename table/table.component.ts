/**
 * Created by Liran on 01/03/2016.
 */
/*
    The wrapping component for David mudlers paper datatable.
    In order to understand the table features and API search it on google.
    We edited some lines in his code so it will work for us in angular 2
    and made the wrapper API save some cubersome settings and features that
    are defined outside of the data table iteself even in mudlers examples.

    API and features:
    1) All @Inputs are must, you can understand them easily by looking at their defenition.
    2) Editing of complex object field is NOT out of the box supported, there is a work around,
    you need to first flat your data in the loader (ashual already wrote JSON.flatArrayItems
    in utilities.js in the project main folder.) and when you set or update your data from
    changes in the table, remember to unflat.
    3) You can get an instance of the table to use the api with the TableService
    (helps if you don't have easy access to the table dom object)
    4) Added support for add, delete, edit features from outside. The rest
    of the features were already part of the paper data table.
    5) When implementing the loader, it is called directly by the paper table, and
       takes care of displaying an error if it occurs (by returning a boolean from the outside)
       In our wrapper features such as editRow, delete, add, There is no error handling
       internally in the wrapper, so prompting the user about a problem should happen outside
 */
import {Component, OnInit, OnDestroy, ViewChild, ElementRef, Input} from "angular2/core";
import {ColoumnInterface} from "./column.interface";
import {DataResultInterface} from "./data-result.interface";
import {TableService} from "./table.service";
import {SortTableInterface} from "./sort.interface";
import {PropertyMissingException} from "../../exceptions/property-missing.exception";

@Component({
    moduleId: __moduleName,
    selector: "ngw-table",
    styles: [`
        .noDataHeader {
            font-size: 5vh;
        }
    `],
    templateUrl: "table.component.html"

})
export class TableComponent implements OnInit, OnDestroy {

    public dataSource: any;
    public pageSizeOptions: number[];
    public pageSize: number;

    @Input("id") public id: any;
    @Input("cols") public cols: ColoumnInterface[];
    @Input("loader") public loader: (orderBy: SortTableInterface, skip: number, limit: number) => Promise<DataResultInterface>;

    // Returns boolean to indicate if the update was a success or failure
    // This is the method the paper table calls when we inline edit a cell.
    @Input("update") public update: (itemId: number, property: string, value: any, rowData: {id: number}) => Promise<boolean>;

    // Returns boolean to indicate if the update was a success or failure
    @Input("add") public add: () => Promise<boolean>;

    // Returns boolean to indicate if the update was a success or failure
    @Input("editRow") public editRow: (row: any) => Promise<boolean>;

    @Input("deleteSelected") public deleteSelected: (rows: any[]) => Promise<boolean>;
    @Input("selectable") public selectable: boolean;
    @Input("multiSelection") public multiSelection: boolean;
    @Input("header") public header: string;
    @ViewChild("dataTable") private dataTable: ElementRef;
    @ViewChild("dataTableCard") private dataTableCard: ElementRef;


    constructor(private tableService: TableService) {
    }

    private static checkDefinedProperty(propertyName: string, value: any): void {
        if (value === undefined || value === null) {
            throw new PropertyMissingException(propertyName + " must defined for table");
        }
    }

    public ngOnInit(): void {

        // Throw exception when one of this properties is not initialized
        this.checkInit();

        // Adding the table to the table service, so others can access it when they need to.
        this.tableService.addTable(this.id, this);

        // Order cols from beginning to end, this init in reverse order because 'rtl' reverse it
        this.cols = this.cols.reverse();
        this.pageSizeOptions = [5, 10, 20];
        this.pageSize = 5;

        let self: TableComponent = this;

        this.dataSource = {
            get: (sort: SortTableInterface, page: number, pageSize: number): Promise<any> => {
                return new Promise((resolve: any) => {
                    self.loader(sort, (page - 1) * pageSize, pageSize).then((returnData: DataResultInterface) => {
                        self.dataTableCard.nativeElement.set("dataSource.length", returnData.totalNumOfRows);
                        resolve(returnData.data);
                    });
                });
            },
            length: 0,
            set: (item: {id: number}, property: string, value: any): Promise<any> => {
                return self.update(item.id, property, value, item);
            }
        };
    }

    public addRowButtonClick(): void {
        let self: TableComponent = this;
        this.add().then((success: boolean) => {
            if (success) {
                // Refresh the table, so the added row will be seen by the user
                self.dataTableCard.nativeElement.retrieveVisibleData();
            }
        });
    }

    public editRowButtonClick(): void {

        this.editRow(this.dataTable.nativeElement.selectedItems[0]).then((success: boolean) => {
            if (success) {
                this.dataTableCard.nativeElement.retrieveVisibleData();
                this.dataTableCard.nativeElement.deselectAll();
            }
        });
    }

    public deleteSelectedRowsButtonClick(): void {

        this.deleteSelected(this.dataTable.nativeElement.selectedItems).then((success: boolean) => {
            if (success) {
                this.dataTableCard.nativeElement.retrieveVisibleData();
                this.dataTableCard.nativeElement.deselectAll();
            }
        });
    }

    public getTableElement(): any {

        return this.dataTableCard.nativeElement;
    }

    public ngOnDestroy(): void {

        this.tableService.remove(this.id);
    }

    private checkInit(): void {

        TableComponent.checkDefinedProperty("id", this.id);
        TableComponent.checkDefinedProperty("cols", this.cols);
        TableComponent.checkDefinedProperty("loader", this.loader);
        TableComponent.checkDefinedProperty("update", this.update);
        TableComponent.checkDefinedProperty("add", this.add);
        TableComponent.checkDefinedProperty("editRow", this.editRow);
        TableComponent.checkDefinedProperty("deleteSelected", this.deleteSelected);

        if (this.cols.length === 0) {
            throw new PropertyMissingException("cols " + "must defined with at least one coloumn in array");
        }
    }
}
