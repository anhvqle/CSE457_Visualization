const dates = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
let amusementRides = [
  {
    id: 1,
    name: "amusement1",
    price: 100,
    opening: dates.slice(-2),
  },
  {
    id: 2,
    name: "amusement2",
    price: 50,
    opening: dates.slice(0, 5),
  },
  {
    id: 1,
    name: "amusement3",
    price: 1000,
    opening: dates.slice(-2),
  },
];

console.log("3 attractions created");
console.log("First attraction's name is: ", amusementRides[0].name);
console.log(
  "Second attraction are open on: ",
  amusementRides[1].opening.join(", ")
);

console.log(
  "Second attraction's first opening day is: ",
  amusementRides[1].opening[0]
);

console.log(
  "Third attraction's price after discount is: ",
  amusementRides[2].price * 0.5
);

function doublePrices(amusementRides) {
  return amusementRides.map((a, index) => {
    aClone = { ...a };
    if (index != 1) aClone.price *= 2;
    return aClone;
  });
}

var amusementRidesDouble = doublePrices(amusementRides);
console.log(amusementRidesDouble);

function debugAmusementRides(amusementRides) {
  for (let ride in amusementRides) {
    console.log(amusementRides[ride].name + " - " + amusementRides[ride].price);
  }
}

debugAmusementRides(amusementRidesDouble);

function addInfo(amusementRides) {
  for (let ride in amusementRides) {
    let amusement = document.createElement("ul");
    let info = document.createElement("ul");

    let name = document.createElement("li");
    let price = document.createElement("li");
    let openingDays = document.createElement("li");

    name.innerHTML = "Name: " + amusementRides[ride].name;
    price.innerHTML = "$" + amusementRides[ride].price;
    openingDays.innerHTML =
      "Open on: " + amusementRides[ride].opening.join(", ");

    info.append(price);
    info.append(openingDays);

    amusement.append(name);
    amusement.append(info);

    let element = document.getElementById("amusements");
    element.appendChild(amusement);
  }
}

addInfo(amusementRidesDouble);
