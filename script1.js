// Donor Registration

let donorForm = document.getElementById("donorForm");

if (donorForm) {

    donorForm.addEventListener("submit", function(event) {

        event.preventDefault();

      
           let donor = {
    id: Date.now(),
    name: document.getElementById("donorName").value,
            blood: document.getElementById("bloodGroup").value,
            phone: document.getElementById("donorPhone").value,
            email: document.getElementById("donorEmail").value,
            location: document.getElementById("donorLocation").value,
            availability: document.getElementById("availability").value
        };

        fetch("http://localhost:3000/donors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(donor)
        })

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            document.getElementById("donorMessage").innerHTML =
                data.message;

            donorForm.reset();

        });

    });
}

// Display Donors

let donorList = document.getElementById("donorList");

if (donorList) {

    fetch("http://localhost:3000/donors")

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {

        donorList.innerHTML = "";

        for (let i = 0; i < data.donors.length; i++) {

            donorList.innerHTML += `
                <div class="card">
                    <h3>${data.donors[i].name}</h3>
                    <p>Blood Group: ${data.donors[i].blood}</p>
                    <p>Phone: ${data.donors[i].phone}</p>
                    <p>Email: ${data.donors[i].email}</p>
                    <p>Location: ${data.donors[i].location}</p>
                    <p>Availability: ${data.donors[i].availability}</p>
                </div>
            `;
        }
    });
}


// Search and Filter Donors

let searchDonor = document.getElementById("searchDonor");
let filterBlood = document.getElementById("filterBlood");

if (searchDonor && filterBlood) {

    function searchDonors() {

        let search = searchDonor.value.toLowerCase();
        let blood = filterBlood.value;

        fetch("http://localhost:3000/donors")

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            donorList.innerHTML = "";

            for (let i = 0; i < data.donors.length; i++) {

                let donor = data.donors[i];

                if (
                    (donor.name.toLowerCase().includes(search) ||
                    donor.location.toLowerCase().includes(search))
                    &&
                    (blood === "" || donor.blood === blood)
                ) {

                    donorList.innerHTML += `
                        <div class="card">
                            <h3>${donor.name}</h3>
                            <p>Blood Group: ${donor.blood}</p>
                            <p>Phone: ${donor.phone}</p>
                            <p>Email: ${donor.email}</p>
                            <p>Location: ${donor.location}</p>
                            <p>Availability: ${donor.availability}</p>
                        </div>
                    `;
                }
            }
        });
    }

    searchDonor.addEventListener("input", searchDonors);

    filterBlood.addEventListener("change", searchDonors);
}


// Emergency Request

let requestForm = document.getElementById("requestForm");

if (requestForm) {

    requestForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let request = {
            id: Date.now(),
            patient: document.getElementById("patientName").value,
            blood: document.getElementById("requiredBlood").value,
            quantity: document.getElementById("quantity").value,
            hospital: document.getElementById("hospitalName").value,
            location: document.getElementById("requestLocation").value,
            date: document.getElementById("requiredDate").value,
            description: document.getElementById("description").value,
            contact: document.getElementById("requestContact").value,
            status: "Pending"
        };

        fetch("http://localhost:3000/requests", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(request)

        })

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            document.getElementById("requestMessage").innerHTML =
                data.message;

            requestForm.reset();

        });

    });
}


// Display Emergency Requests

let requestList = document.getElementById("requestList");

if (requestList) {

    fetch("http://localhost:3000/requests")

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {

        requestList.innerHTML = "";

        for (let i = 0; i < data.requests.length; i++) {

            let request = data.requests[i];

            requestList.innerHTML += `
                <div class="card">
                    <h3>${request.blood} Blood Required</h3>
                    <p>Patient: ${request.patient}</p>
                    <p>Quantity: ${request.quantity}</p>
                    <p>Hospital: ${request.hospital}</p>
                    <p>Location: ${request.location}</p>
                    <p>Date: ${request.date}</p>
                    <p>Description: ${request.description}</p>
                    <p>Contact: ${request.contact}</p>
                   <p class="status">Status: ${request.status}</p>

<button onclick="updateStatus(${request.id}, 'Fulfilled')">
    Fulfilled
</button>

<button onclick="updateStatus(${request.id}, 'Cancelled')">
    Cancelled
</button>
                </div>
            `;
        }
    });
}
function updateStatus(id, status) {

    fetch("http://localhost:3000/requests/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status: status
        })

    })

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {

        alert(data.message);

        location.reload();

    });
}

