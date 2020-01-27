//Selectors
const monitor = document.querySelector('.monitor');
const vehicalCard = document.querySelectorAll('.vcard');
const selectCustomer = document.getElementById('selectCustomer');
const customerName = document.querySelectorAll('.customer-name');
const selectVehical = document.getElementById('selectVehical');
const searchVehicalForm = document.querySelector('#searchVehicals');

document.querySelectorAll('.vregnr').forEach(x => console.log(x.textContent));


/*Filter via customer*/
selectCustomer.addEventListener('change', () => {
    document.querySelectorAll('.customer-name').forEach(name => {
        if (selectCustomer.value !== name.innerText.replace(/ +/g, "").toLowerCase()) {
            name.parentElement.classList.add('hideit');
            if (selectCustomer.value === 'all') {
                name.parentElement.classList.remove('hideit');
            } else {
                name.parentElement.classList.add('hideit');
            }
        } else if (selectCustomer.value === name.innerText.replace(/ +/g, "").toLowerCase()) {
            name.parentElement.classList.remove('hideit');
        }
    });
});

/*Filter via status*/
selectVehical.addEventListener('change', () => {
    document.querySelectorAll('.status').forEach(status => {
        if (selectVehical.value !== status.innerText.toLowerCase()) {
            if (selectVehical.value === 'all') {
                status.parentElement.parentElement.classList.remove('hideit');
            } else {
                status.parentElement.parentElement.classList.add('hideit');
            }
        } else if (selectVehical.value === status.innerText.toLowerCase()) {
            status.parentElement.parentElement.classList.remove('hideit');
        }
    })
});

//Monetering Customer Vehicals
function MonitoringVehicals(customer, id) {
    customer.vehicals.forEach(vehical => {
        const htmlTemplate = `
    <div class="vcard" data-id = ${id}>
            <div class="vcard-id">
                <div class="vcard-vin-ct">
                    <span class="vcard-vin">Vechical ID:</span> 
                    <span>${vehical.vin}</span> 
                </div>
                ${
            vehical.status ? "<span class='status active'>Connected</span>" :
                "<span class='status inactive'>Disconnected</span>"
            }
            </div >
        <div class='vcard-regid'>
         
                <p>Vehical Registration Number:</p>
                <h3 class='vregnr'>${vehical.reg_nr}<h3 />

            </div>
            <hr>
               <span><img src='/icons/customericon.png'/ width="20px"></span>
             <p class='customer-name' data-id = ${id}>${customer.name}</p>
        </div>`;
        monitor.innerHTML += htmlTemplate;
    });
};

//Fetching Customer
db.collection('customers').get().then((snapshot) => {
    snapshot.docs.map(doc => {
        selectCustomer.innerHTML += `<option value=${doc.data().name.replace(/ +/g, "").toLowerCase()}>${doc.data().name}</option>`;

    });
}).catch(err => console.log(err));

//Realtime Fetching customer
db.collection('customers').onSnapshot(snapshot => {
    snapshot.docChanges().map(change => {
        const doc = change.doc;
        if (change.type === 'added') {
            MonitoringVehicals(doc.data(), doc.id);

        } else if (change.type === 'modified') {
            MonitoringVehicals(doc.data(), doc.id);
            doc.data().vehicals.map(x => {
                if (x.status) {
                    document.querySelectorAll('.status').forEach(z => {
                        z.classList.remove('inactive');
                        z.classList.add('active');
                        z.innerText = 'Connected';
                    })
                } else if (!x.status) {
                    document.querySelectorAll('.status').forEach(z => {
                        z.classList.remove('active');
                        z.classList.add('inactive');
                        z.innerText = 'Disconnected';
                    })

                }
            })
        }
    });
});


/*Show Details*/
function showDetails(customer, id) {
    monitor.addEventListener('click', (e) => {
        if (e.target.classList.contains('customer-name') && e.target.getAttribute('data-id') === id) {
            let showDetails = document.querySelector('#showDetail');
            console.log(customer);
            let html = `
                    <div class='customer-details'>
                    <p>Customer Details<p/>
                    <hr/>
                    <h2>${customer.name}</h2>
                    <h3>${customer.street}, ${customer.city}</h3>
                    <h4>${customer.postalcode}</h4>
                    <p>Customer Vehicals</p>
                    <hr/>`;
            let html2;
            customer.vehicals.map(vehical => {
                html2 += `
                        <div class='customer-vehical'>
                        <p>VIN: ${vehical.vin}</p>
                        <p>Reg.nr: ${vehical.reg_nr}</p>
                        </div>
                        `;

            });
            const newHtml = `${html}${html2}<div class="close">Close</div>`;
            showDetails.innerHTML = newHtml;
            showDetails.style.display = 'flex';

            document.querySelector('.close').addEventListener('click', () => {
                showDetails.style.display = 'none';
            });
        }
    })
}

db.collection('customers').onSnapshot(snapshot => {
    snapshot.docChanges().map(change => {
        const doc = change.doc;
        showDetails(doc.data(), doc.id);
        doc.data().vehicals[0].status;
    })
});

