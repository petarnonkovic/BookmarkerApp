let initData = [
    { name: 'John Doe', email: 'john.doe@gmail.com' },
    { name: 'Jane Doe', email: 'jane.doe@gmail.com' }
];
let initDataString = JSON.stringify( initData );
//window.localStorage.setItem(database, initDataString);

/*
 *  Local Storage Class
 */
class MyStorage {

    constructor( dbName ) {
        this.database = dbName;

        if ( window.localStorage.getItem( dbName ) === null ) {
            window.localStorage.setItem( dbName, '[]' );
            this.storage = [];
        } else {
            this.storage = JSON.parse( window.localStorage.getItem( dbName ) );
        }
    }

    getAllItems() {
        return this.storage;
    }

    clearStorage() {
        try {
            window.localStorage.removeItem( this.database );
            console.log( 'Local Storage database "' + this.database + '" removed' );
        } catch ( err ) {
            console.error( 'Error on clearing database.' );
        }
    }

    addStorageItem( item ) {
        let data = this.getAllItems();
        data.push( item );
        try {
            window.localStorage.setItem( this.database, JSON.stringify( data ) );
            console.log( 'New Item Added to localStorage.' );
        } catch ( err ) {
            console.error( 'Error on save item: ' + err );
        }
    }

    removeStorageItem( index ) {
        let data = this.getAllItems();
        let id = parseInt( index, 10 );
        data.splice( id, 1 );
        try {
            window.localStorage.setItem( this.database, JSON.stringify( data ) );
            console.log( 'Item Removed from localStorage.' );
        } catch ( err ) {
            console.error( 'Error on removing item: ' + err );
        }
    }

}

class OutputHandler {

    constructor( tableSelector, storage ) {
        this.table = tableSelector;
        this.storage = storage;
        this.counter = 0;
    }

    addTableRow( dataRow ) {

        // create and append row
        let newRow = this.table.insertRow( -1 );
        newRow.setAttribute( 'class', 'b_row' );

        /**  create and add data cells  **/

        // name Cell
        let nameCell = newRow.insertCell( 0 );
        nameCell.setAttribute( 'class', 'b_name' );
        nameCell.appendChild( document.createTextNode( dataRow.name ) );

        /** controll Cells **/
        // visit bookmark link
        let visitLinkCell = newRow.insertCell( 1 );
        visitLinkCell.setAttribute( 'class', 'b_visit' );
        let visitLink = document.createElement( 'a' );
        visitLink.appendChild( document.createTextNode( 'Visit' ) );
        visitLink.setAttribute( 'class', 'visit' );
        visitLink.setAttribute( 'href', dataRow.url );
        visitLink.setAttribute( 'target', '_blank' );
        visitLinkCell.appendChild( visitLink );

        // remove bookmark button
        let removeBtnCell = newRow.insertCell( 2 );
        removeBtnCell.setAttribute( 'class', 'b_remove' );
        let removeBtn = document.createElement( 'button' );
        removeBtn.appendChild( document.createTextNode( 'Remove' ) );
        removeBtn.setAttribute( 'class', 'remove' );
        removeBtn.setAttribute( 'data-row-index', this.counter );
        this.counter++;
        removeBtn.setAttribute( 'type', 'button' );
        removeBtnCell.appendChild( removeBtn );
    }

    removeTableRow( rowIndex ) {
        let idx = parseInt( rowIndex, 10 );
        this.table.deleteRow( idx );
    }

    renderTable() {
        this.table.innerHTML = '';
        if ( this.storage.length > 0 ) {
            this.storage.forEach( ( row ) => {
                this.addTableRow( row);
            } );
        } else {
            console.log('Add some bookmarks to storage');
        }
    }

    clearTable() {
        this.table.innerHTML = '';
        console.log('Table is empty.');
    }

}

let database = 'bMarks';

let table = document.getElementById( 'listing' );
let form = document.getElementById( 'ls_form' );
let inpName = form.elements[ 'b_name' ];
let inpUrl = form.elements[ 'b_url' ];
let clearBtn = document.getElementById( 'clearIt' );



document.addEventListener( 'DOMContentLoaded', function(e) {

    let myStorage = new MyStorage( database );
    let storageData = myStorage.getAllItems();
    let tableHandler = new OutputHandler( table, storageData );

    // render storage data
    tableHandler.renderTable();

    /*** Events Handlers ***/

    // handle form submit
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        let name = inpName.value;
        let url = inpUrl.value;
        // validate name & url
        if (name === '' && url === '') {
            alert( 'Please fill all fields.' );
            return false;
        }

        const regex = /(https?):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if ( !regex.test( url ) ) {
            alert( "Please enter valid URL." );
            return false;
        }

        let newBookmark = {};
        newBookmark['name'] = name;
        newBookmark['url'] = url;

        myStorage.addStorageItem(newBookmark);
        location.reload();

    });

    // handle clear storage
    clearBtn.addEventListener('click', (ev) => {
        tableHandler.clearTable();
        myStorage.clearStorage();
    });

    // remove button handler
    const removeBtns = document.querySelectorAll( '.remove' );
    removeBtns.forEach((item) => {
        item.addEventListener('click', (e) => {
            let rowIndex = parseInt(event.currentTarget.getAttribute('data-row-index'), 10);
            tableHandler.removeTableRow(rowIndex);
            myStorage.removeStorageItem(rowIndex);
        });
    })

} );
