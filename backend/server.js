const http = require("http");
const fs = require("fs");

const server = http.createServer(function(req, res) {

    // Allow frontend to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle browser permission request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // GET donors
    if (req.url === "/donors" && req.method === "GET") {

        let data = fs.readFileSync("backend/data.json");

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(data);
    }

    // POST donor
    else if (req.url === "/donors" && req.method === "POST") {

        let body = "";

        req.on("data", function(data) {
            body = body + data;
        });

        req.on("end", function() {

            let newDonor = JSON.parse(body);

            let fileData =
                fs.readFileSync("backend/data.json");

            let data = JSON.parse(fileData);

            data.donors.push(newDonor);

            fs.writeFileSync(
                "backend/data.json",
                JSON.stringify(data, null, 2)
            );

            res.writeHead(201, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Donor added successfully"
            }));
        });
    }

    // POST emergency request
else if (req.url === "/requests" && req.method === "POST") {

    let body = "";

    req.on("data", function(data) {
        body = body + data;
    });

    req.on("end", function() {

        let newRequest = JSON.parse(body);

        let fileData =
            fs.readFileSync("backend/data.json");

        let data = JSON.parse(fileData);

        data.requests.push(newRequest);

        fs.writeFileSync(
            "backend/data.json",
            JSON.stringify(data, null, 2)
        );

        res.writeHead(201, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Emergency request created successfully"
        }));
    });
}

// GET emergency requests
else if (req.url === "/requests" && req.method === "GET") {

    let data = fs.readFileSync("backend/data.json");

    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    res.end(data);
}

// Update emergency request status

else if (req.url.startsWith("/requests/") && req.method === "PUT") {

    let id = req.url.split("/")[2];

    let body = "";

    req.on("data", function(data) {
        body = body + data;
    });

    req.on("end", function() {

        let update = JSON.parse(body);

        let fileData = fs.readFileSync("backend/data.json");
        let data = JSON.parse(fileData);

        let found = false;

        for (let i = 0; i < data.requests.length; i++) {

            if (data.requests[i].id == id) {

                data.requests[i].status = update.status;
                found = true;
            }
        }

        if (found) {

            fs.writeFileSync(
                "backend/data.json",
                JSON.stringify(data, null, 2)
            );

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Request status updated"
            }));

        } else {

            res.writeHead(404, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Request not found"
            }));
        }
    });
}
// Update donor

else if (req.url.startsWith("/donors/") && req.method === "PUT") {

    let id = req.url.split("/")[2];

    let body = "";

    req.on("data", function(data) {
        body = body + data;
    });

    req.on("end", function() {

        let update = JSON.parse(body);

        let fileData = fs.readFileSync("backend/data.json");
        let data = JSON.parse(fileData);

        let found = false;

        for (let i = 0; i < data.donors.length; i++) {

            if (data.donors[i].id == id) {

                data.donors[i].name = update.name;
                data.donors[i].blood = update.blood;
                data.donors[i].phone = update.phone;
                data.donors[i].email = update.email;
                data.donors[i].location = update.location;
                data.donors[i].availability = update.availability;

                found = true;
            }
        }

        if (found) {

            fs.writeFileSync(
                "backend/data.json",
                JSON.stringify(data, null, 2)
            );

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Donor updated successfully"
            }));

        } else {

            res.writeHead(404, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Donor not found"
            }));
        }
    });
}
    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("Page not found");
    }

});

server.listen(3000, function() {
    console.log("Server running at http://localhost:3000");
});