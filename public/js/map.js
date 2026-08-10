document.addEventListener("DOMContentLoaded", function () {

    const mapElement = document.getElementById("map");

    // If this page doesn't contain a map, stop.
    if (!mapElement) {
        return;
    }

    const latitude = Number(mapElement.dataset.latitude);
    const longitude = Number(mapElement.dataset.longitude);
    const locationName = mapElement.dataset.location;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Location:", locationName);
    console.log("Leaflet:", typeof L);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        console.error("Invalid latitude or longitude");
        return;
    }

    if (typeof L === "undefined") {
        console.error("Leaflet is not loaded!");
        return;
    }

    // Create map
    const map = L.map("map").setView(
        [latitude, longitude],
        15
    );
 // 2  → very zoomed out
// 5  → country/large region
// 10 → city/large area
// 13 → city
// 15 → detailed city area
// 18 → very detailed
    // OpenStreetMap tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
           
        }
    ).addTo(map);

    // Marker
    L.marker([
        latitude,
        longitude
    ])
    .addTo(map)
    .bindPopup(
        `<b>Exacts Location After Registration -${locationName}</b>`
    )
    .openPopup();

});