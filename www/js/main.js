// @param 
// param1: evt:EventObject
// @func
// Only allow number to pass through
// @return
// Boolean
function isNumberKey(evt) {
    // Get the char code from the event
    var charCode = (evt.which) ? evt.which : evt.keyCode
    // Check if the char code within the approriate range
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

// @param 
// param1: slug: String
// @func
// Get the name from the slug of the city
// Example: can_tho == Can Tho
// @return
// cityname: String
const getCityNameBySlug = (slug) => {
    const cities = tinh_tp_data;
    let cityName;

    for (const city in cities) {
        if (cities[city].slug === slug) {
            cityName = cities[city].name;
            break;
        }
    }

    return cityName;
}

// Global Object
const moneyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});
const menuClose = document.querySelector(".menu-close");
const menuOpen = document.querySelector(".menu-open");
const menu = document.querySelector(".menu");
const body = document.querySelector("body");

// Create event listener for menu
menuOpen.addEventListener("click", (e) => {
    menu.classList.add("active");
    body.classList.add("blurred");
})

// Create event listener for menu
menuClose.addEventListener("click", (e) => {
    menu.classList.remove("active");
    body.classList.remove("blurred");
})

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBI3WP5JZeEk5k3Lj_utvNf7AGECrP3x7o",
    authDomain: "mobile-property-api.firebaseapp.com",
    databaseURL: "https://mobile-property-api.firebaseio.com",
    projectId: "mobile-property-api",
    storageBucket: "mobile-property-api.appspot.com",
    messagingSenderId: "679318469788",
    appId: "1:679318469788:web:23a9e45f7bd75281368159",
    measurementId: "G-T79XY24DCW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
// Create DB
const db = firebase.firestore();

// @param 
// param1: input: Node
// param2: message: String
// @func
// Set the message as an error for the input
// @return
// null
function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-group error';
    small.innerText = message;
}

// @param 
// param1: input: Node
// @func
// Set success for the input
// @return
// null
function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-group success';
}

// @param 
// param1: e: EventObject
// @func
// Add the image into the property object in the database
// @return
// null
const addImageFunctionality = async (e) => {
    e.preventDefault();

    const propertyImageFile = document.getElementById("property-image-file");

    let file = propertyImageFile.files[0];

    // Create a storage ref
    let storageRef = firebase.storage().ref('properties_images/' + file.name);

    const propertyID = localStorage.getItem("propertyID");
    const propertyItem = JSON.parse(localStorage.getItem("property"));
    let updatedProperty = {};

    // Get the download URL
    const imageURL = await storageRef.getDownloadURL()

    // Check to see if the imageList exists
    if (propertyItem.imageList) {
        updatedProperty = {
            imageList: [...propertyItem.imageList, imageURL]
        }
    } else {
        updatedProperty = {
            imageList: [imageURL]
        }
    }

    const d = await db.collection("properties").doc(propertyID).update(updatedProperty)

    // Redirect to the property
    window.location.href = "./property-details.html";
}

// @param 
// none
// @func
// Upload the image from the input:file to the database
// And get back the link to display for the users to review
// @return
// null
const uploadImageAbility = () => {
    const uploadImageBar = document.getElementById("upload-image-bar");
    const propertyImageFile = document.getElementById("property-image-file");
    const uploadedImage = document.getElementById("uploaded-image");

    if (!uploadImageBar || !propertyImageFile || !uploadedImage) {
        return;
    }

    propertyImageFile.addEventListener("change", (e) => {
        // Get file
        let file = e.target.files[0];

        // Create a storage ref
        let storageRef = firebase.storage().ref('properties_images/' + file.name);

        // Upload file
        let task = storageRef.put(file);

        // Update progress bar
        task.on("state_changed",
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadImageBar.setAttribute("style", `width: ${percentage}%`);
            },

            function error(err) {
                console.log(err);
            },

            function complete() {
                // Get download URL
                storageRef.getDownloadURL().then(function (url) {
                    uploadedImage.setAttribute("src", url)
                }).catch(function (error) {
                    console.log(error);
                });
            }
        )

    })
}

// @param 
// none
// @func
// Get all the input fields in the property to validate
// @return
// Boolean
const checkInputsForAddProperty = () => {
    const form = document.querySelector("#add-property-form");

    let isCorrect = true;

    // Get value from all input fields
    const propertyTypeValue = form.propertyType.value.trim();
    const bedroomsValue = form.bedrooms.value.trim();
    const monthlyRentPriceValue = form.monthlyRentPrice.value.trim();
    const furnitureTypeValue = form.furnitureType.value.trim();
    const cityValue = form.city.value.trim();
    const noteValue = form.note.value.trim();
    const nameOfTheReporterValue = form.nameOfTheReporter.value.trim();

    // Data validation --start
    if (propertyTypeValue === '') {
        setErrorFor(form.propertyType, 'Property type cannot be blank');
        isCorrect = false;
    } else {
        setSuccessFor(form.propertyType);
    }

    if (bedroomsValue === '') {
        setErrorFor(form.bedrooms, 'Bedrooms cannot be blank');
        isCorrect = false;
    } else {
        setSuccessFor(form.bedrooms);
    }

    if (monthlyRentPriceValue === '') {
        setErrorFor(form.monthlyRentPrice, 'Monthly rent price cannot be blank');
        isCorrect = false;
    } else {
        setSuccessFor(form.monthlyRentPrice);
    }

    if (cityValue === '') {
        setErrorFor(form.city, 'City cannot be blank');
        isCorrect = false;
    } else {
        setSuccessFor(form.city);
    }

    if (nameOfTheReporterValue === '') {
        setErrorFor(form.nameOfTheReporter, 'Name of the reporter cannot be blank');
        isCorrect = false;
    } else {
        setSuccessFor(form.nameOfTheReporter);
    }
    // Data validation --end

    return isCorrect;
}

// @param 
// param1: list: Array
// param2: searchObject: Object
// @func
// Convert the input list to a searched list 
// corresponding to the criteria in the searchObject
// @return
// returnedList: Array
const detailedSorter = (list, searchObject) => {
    let returnedList = [];

    //Destructure the searchObject
    const {
        propertyType,
        bedrooms,
        monthlyRentPriceMin,
        monthlyRentPriceMax,
        furnitureType,
        city,
        nameOfTheReporter
    } = searchObject;

    // Filter procedure --start
    if (propertyType) {
        list = list.filter(doc => {
            const element = doc.data();
            return element.propertyType === propertyType;
        })
    }

    if (bedrooms) {
        list = list.filter(doc => {
            const element = doc.data();
            return element.bedrooms === bedrooms;
        })
    }

    if (furnitureType) {
        list = list.filter(doc => {
            const element = doc.data();
            return element.furnitureType === furnitureType;
        })
    }

    if (city) {
        list = list.filter(doc => {
            const element = doc.data();
            return element.city === city;
        })
    }

    if (monthlyRentPriceMin && monthlyRentPriceMax) {
        list = list.filter(doc => {
            const element = doc.data();
            return parseFloat(element.monthlyRentPrice) >= parseFloat(monthlyRentPriceMin) && parseFloat(element.monthlyRentPrice) <= parseFloat(monthlyRentPriceMax);
        })
    }

    if (monthlyRentPriceMin && !monthlyRentPriceMax) {
        list = list.filter(doc => {
            const element = doc.data();
            return parseFloat(element.monthlyRentPrice) >= parseFloat(monthlyRentPriceMin);
        })
    }

    if (monthlyRentPriceMax && !monthlyRentPriceMin) {
        list = list.filter(doc => {
            const element = doc.data();
            return parseFloat(element.monthlyRentPrice) <= parseFloat(monthlyRentPriceMax);
        })
    }

    if (nameOfTheReporter) {
        list = list.filter(doc => {
            const element = doc.data();
            return element.nameOfTheReporter.toLowerCase().includes(nameOfTheReporter.toLowerCase());
        })
    }
    // Filter procedure --end

    // Push each element into the returned list
    list.forEach(doc => {
        const element = doc.data();
        returnedList.push({
            ...element,
            id: doc.id
        });
    })

    return returnedList;
}

// @param 
// param1: e: EventObject
// @func
// Store search criteria in the localStorage
// @return
// null
const onDetailedSearchSubmit = (e) => {
    e.preventDefault();
    const form = document.querySelector("#detailed-search-form");

    // Create searchObject
    const searchObject = {
        propertyType: form.propertyType.value,
        bedrooms: form.bedrooms.value,
        monthlyRentPriceMin: form.monthlyRentPriceMin.value,
        monthlyRentPriceMax: form.monthlyRentPriceMax.value,
        furnitureType: form.furnitureType.value,
        city: form.city.value,
        nameOfTheReporter: form.nameOfTheReporter.value
    }

    // Create localStorage
    localStorage.setItem("searchObject", JSON.stringify(searchObject));

    // Redirect
    window.location.href = "./searched-property-list.html"
}

// @param 
// none
// @func
// Calculate the total cost accroding to the inputs
// @return
// null
const calculateTheCost = () => {
    const costCalForm = document.querySelector("#cost-cal-form");
    const rentalCostResult = document.querySelector("#rental-cost-result");
    let result = 0;

    // Get value from the calculator form
    const monthlyRentPrice = costCalForm.monthRent.value;
    const monthStay = costCalForm.monthStay.value;
    const tax = costCalForm.tax.value;

    let monthCounter = 0;
    let monthlyRentalPayment = monthlyRentPrice;

    // Create an iteraton for it to automatically 
    // Add the monthly rent to the result
    for (let index = 0; index < monthStay; index++) {
        monthCounter++;
        // Everytime the monthCounter hit 12 
        if (monthCounter > 12) {
            // monthlyRentalPayment will be added 5%
            monthlyRentalPayment = parseInt(monthlyRentPrice) + parseInt(monthlyRentalPayment) * 5 / 100;
            monthCounter = 0;
        }
        result += parseInt(monthlyRentalPayment);
    }

    result += (result * parseInt(tax)) / 100;

    const rentalCostResultText = moneyFormatter.format(result + monthlyRentPrice * 2);

    // Print out the result
    rentalCostResult.innerHTML = `${rentalCostResultText}`;
}

// @param 
// param1: e: EventObject
// @func
// Print out the initial payment
// @return
// null
const renderInitRentalPayment = (e) => {
    const initRentalPayment = document.querySelector("#init-rental-payment p");
    const monthlyRentPrice = e.target.value;

    if (!initRentalPayment) {
        return;
    }

    const initRentalPaymentText = moneyFormatter.format(monthlyRentPrice * 2);

    initRentalPayment.innerHTML = initRentalPaymentText;
}

// @param 
// param1: e: EventObject
// @func
// Render the searched properties list onto the screen
// @return
// null
const renderSearchPropertyList = async (e) => {
    try {
        const searchObject = JSON.parse(localStorage.getItem("searchObject"));
        const searchPropertyListTag = document.querySelector("#searched-property-list");

        if (!searchPropertyListTag) {
            return;
        }

        // Get all properties
        const propertyList = document.querySelector(".property-list");
        propertyList.innerHTML = "";
        let propertiesData = await db.collection("properties").get()
        let currentProperties = [];

        // Get the filtered properties
        currentProperties = detailedSorter(propertiesData.docs, searchObject);

        // If no property match the search criteria
        if (currentProperties.length === 0) {
            // Print this message
            propertyList.innerHTML = `
                <p>Currently there is no property that matches the search criteria</p>
                <a href="./detail-search-property.html" class="btn btn-primary">Search Again</a>
            `
        }

        // Otherwise, print all the properties
        currentProperties = sortTheProperties(currentProperties);
        currentProperties.forEach((propertyItem, index) => {
            renderProperty(propertyItem, index + 1)
        })
        enableViewMorePropertyButton()
    } catch (error) {
        console.log(error);
    }
}

// @param 
// param1: e: EventObject
// @func
// Find the note based on the author's name and render them out
// @return
// null
const onSearchNoteAuthor = async (e) => {
    try {
        e.preventDefault();
        const authorForm = document.querySelector("#author-form");
        const noteList = document.querySelector(".note-list");
        if (!noteList || !authorForm) {
            return;
        }

        noteList.innerHTML = "";

        const propertyID = localStorage.getItem("propertyID");
        const notesData = await db.collection("notes").where("propertyID", "==", propertyID).get()
        let currentNotesList = notesData.docs;

        // Get the author's name
        const authorName = authorForm.author.value;

        if (authorName != "") {
            currentNotesList = notesData.docs.filter(doc => {
                const note = doc.data();
                return note.author.toLowerCase().includes(authorName.toLowerCase());
            })
        }

        // If there is no note
        if (currentNotesList.length === 0) {
            
            // Print out the message
            noteList.innerHTML = `
                <p>Currently there is no note for this property of ${authorName}</p>
                <a href="./add-note.html" class="btn btn-primary">Create Note</a>
            `
            return;
        }

        // Otherwise, render all the notes
        currentNotesList.forEach((doc, index) => {
            renderNote({
                ...doc.data(),
                id: doc.id
            }, index + 1)
        })
    } catch (error) {
        console.log(error);
    }
}

// @param 
// param1: e: EventObject
// @func
// Get the note data and put in the database
// @return
// null
const onAddNote = (e) => {
    e.preventDefault();
    const form = document.querySelector("#add-note-form");
    const propertyID = localStorage.getItem("propertyID")

    // Create a new note object
    const newNote = {
        note: form.note.value,
        author: form.author.value,
        propertyID
    }

    // Put the note object into the database
    db.collection("notes").add(newNote)

    form.note.value = "";
    form.author.value = "";
}

// @param 
// param1: imageURL: String
// param2: index: Int
// @func
// Render an image based on the imageURL
// @return
// null
const renderImage = (imageURL, index) => {
    const imageList = document.querySelector(".image-list");

    // Create new image item
    const imageItem = `
        <li class="image-item card">
            <img src="${imageURL}" alt="Image ${index}"/>
        </li>
    `;

    // Push in the image list
    imageList.innerHTML += imageItem;
}

// @param 
// param1: e: EventObject
// @func
// Render all the images to the all images page
// @return
// null
const renderAllTheImages = async (e) => {
    try {
        const imageList = document.querySelector(".image-list");
        if (!imageList) {
            return;
        }

        imageList.innerHTML = "";

        const propertyID = localStorage.getItem("propertyID");
        const property = JSON.parse(localStorage.getItem("property"));

        // If the image list is empty
        if (!property.imageList || property.imageList.length === 0) {
            // Print out the message
            imageList.innerHTML = `
                <p>Currently there is no image for this property</p>
                <a href="./add-image.html" class="btn btn-primary">Create Image</a>
            `
            return;
        }

        // Otherwise, render them out
        property.imageList.forEach((imageURL, index) => {
            renderImage(imageURL, index + 1)
        })
    } catch (error) {
        console.log(error);
    }
}

// @param 
// param1: noteItemDoc: Doc
// param2: index: Int
// @func
// Render the note
// @return
// null
const renderNote = (noteItemDoc, index) => {
    const {
        id,
        note,
        author
    } = noteItemDoc;
    const noteList = document.querySelector(".note-list");

    // Create note item
    const noteItem = `
        <li class="note-item card">
            <h4>Note ${index}</h4>
            <p>${note}</p>
            <h6><b>Author:</b> ${author}</h6>
        </li>
    `;

    // Push note item to note list
    noteList.innerHTML += noteItem;
}

// @param 
// param1: e: EventObject
// @func
// Render all the notes to the all notes page
// @return
// null
const renderAllTheNotes = async (e) => {
    try {
        const noteList = document.querySelector(".note-list");
        if (!noteList) {
            return;
        }

        noteList.innerHTML = "";

        const propertyID = localStorage.getItem("propertyID");
        const notesData = await db.collection("notes").where("propertyID", "==", propertyID).get()

         // If the note list is empty
        if (notesData.docs.length === 0) {
            // Print out the message
            noteList.innerHTML = `
                <p>Currently there is no note for this property</p>
                <a href="./add-note.html" class="btn btn-primary">Create Note</a>
            `
            return;
        }

        // Otherwise, render them out
        notesData.docs.forEach((doc, index) => {
            renderNote({
                ...doc.data(),
                id: doc.id
            }, index + 1)
        })
    } catch (error) {
        console.log(error);
    }
}

// @param 
// param1: e: EventObject
// @func
// Render the edit property page
// Based on the selected property data
// @return
// null
const renderEditPropertyPage = (e) => {
    const property = JSON.parse(localStorage.getItem("property"));

    const editPropertyForm = document.querySelector("#edit-property-form");

    if (!editPropertyForm) {
        return;
    }

    const {
        propertyType,
        bedrooms,
        createdDate,
        createdTime,
        createdDateTimeText,
        monthlyRentPrice,
        furnitureType,
        city,
        note,
        nameOfTheReporter
    } = property;

    const furnitureSelectBox = document.querySelector("select#edit-furnitureType");

    if (!furnitureSelectBox) {
        return;
    }

    for (let index = 0; index < furniture_condition.length; index++) {
        const element = furniture_condition[index];
        const option = document.createElement("option");
        option.innerHTML = element;
        option.setAttribute("value", element)
        if (element === furnitureType) {
            option.setAttribute("selected", true)
        }
        furnitureSelectBox.appendChild(option);
    }

    const propertySelectBox = document.querySelector("select#edit-propertyType");

    if (!propertySelectBox) {
        return;
    }

    for (let index = 0; index < house_types.length; index++) {
        const element = house_types[index];
        const option = document.createElement("option");
        option.innerHTML = element;
        option.setAttribute("value", element)
        if (element === propertyType) {
            option.setAttribute("selected", true)
        }
        propertySelectBox.appendChild(option);
    }

    const bedroomSelectBox = document.querySelector("select#edit-bedrooms");

    if (!bedroomSelectBox) {
        return;
    }

    for (let index = 0; index < bedrooms_types.length; index++) {
        const element = bedrooms_types[index];
        const option = document.createElement("option");
        option.innerHTML = element;
        option.setAttribute("value", element)
        if (element === bedrooms) {
            option.setAttribute("selected", true)
        }
        bedroomSelectBox.appendChild(option);
    }

    const citySelectBox = document.querySelector("select#edit-city");
    const cities = tinh_tp_data;

    if (!citySelectBox) {
        return;
    }

    for (let index = 0; index < ordered_cities_key.length; index++) {
        const key = ordered_cities_key[index];
        const little_city = cities[key];

        const option = document.createElement("option");
        option.innerHTML = little_city.name;
        option.setAttribute("value", little_city.slug)
        option.setAttribute("text-data", little_city.name)
        if (city === little_city.slug) {
            option.setAttribute("selected", true)
        }
        citySelectBox.appendChild(option);
    }

    const editNoteTextarea = document.getElementById("edit-note");

    if (!editPropertyForm || !editNoteTextarea) {
        return;
    }

    editPropertyForm["edit-monthlyRentPrice"].value = monthlyRentPrice;
    editPropertyForm["edit-nameOfTheReporter"].value = nameOfTheReporter;
    editNoteTextarea.value = note;
}

// @param 
// param1: e: EventObject
// @func
// This trigger when the user update a property
// The new data will replace the old data
// @return
// null
const onUpdateProperty = async (e) => {
    try {
        e.preventDefault();
        const form = document.querySelector("#edit-property-form");
        const propertyID = localStorage.getItem("propertyID");

        const updatedProperty = {
            propertyType: form["edit-propertyType"].value,
            bedrooms: form["edit-bedrooms"].value,
            monthlyRentPrice: form["edit-monthlyRentPrice"].value,
            furnitureType: form["edit-furnitureType"].value,
            city: form["edit-city"].value,
            note: form["edit-note"].value,
            nameOfTheReporter: form["edit-nameOfTheReporter"].value
        }

        const d = await db.collection("properties").doc(propertyID).update(updatedProperty)

        window.location.href = "./property-details.html";
    } catch (error) {
        console.log(error);
    }
}

// @param 
// param1: e: EventObject
// @func
// This trigger when the user delete a property
// A property will be remove completely
// @return
// null
const onDeleteProperty = async (e) => {
    e.stopPropagation();
    const dataID = localStorage.getItem("propertyID");
    await db.collection("properties").doc(dataID).delete();
    localStorage.removeItem("propertyID");
    localStorage.removeItem("property");
    window.location.href = "./index.html";
}

// @param 
// param1: e: EventObject
// @func
// Perform preparation procudure before 
// going to the property details page
// @return
// null
const onGoToPropertyDetails = async (e) => {
    try {
        const dataID = e.target.getAttribute("data-id");
        let propertiesData = await db.collection("properties").doc(dataID).get();
        let property = propertiesData.data();
        localStorage.setItem("propertyID", dataID);
        localStorage.setItem("property", JSON.stringify(property))
        window.location.href = "./property-details.html";
    } catch (error) {
        console.log(error);
    }
}

// @param 
// param1: e: EventObject
// @func
// Get the data from the preparation phase
// and render them onto the screen
// @return
// null
const renderPropertyDetails = async (e) => {
    const propertyDetailsTag = document.querySelector("#property-details");

    const deletePropertyButton = document.querySelector(".delete-button .delete-property-button")
    const propertyTypeDetailsTag = document.querySelector(".details-property-type");
    const bedroomsDetailsTag = document.querySelector(".details-bedrooms");
    const monthlyRentPriceDetailsTag = document.querySelector(".details-monthlyRentPrice");
    const furnitureTypeDetailsTag = document.querySelector(".details-furnitureType");
    const cityDetailsTag = document.querySelector(".details-city");
    const reporterDetailsTag = document.querySelector(".details-reporter");
    const noteDetailsTag = document.querySelector(".details-note");
    const dateDetailsTag = document.querySelector(".details-date");
    const timeDetailsTag = document.querySelector(".details-time");

    if (!propertyDetailsTag) {
        return;
    }

    const dataID = localStorage.getItem("propertyID");
    let propertiesData = await db.collection("properties").doc(dataID).get();
    localStorage.setItem("property", JSON.stringify(propertiesData.data()))

    deletePropertyButton.addEventListener("click", onDeleteProperty)

    const property = JSON.parse(localStorage.getItem("property"));

    const {
        propertyType,
        bedrooms,
        createdDate,
        createdTime,
        createdDateTimeText,
        monthlyRentPrice,
        furnitureType,
        city,
        note,
        nameOfTheReporter
    } = property;

    propertyTypeDetailsTag.innerHTML = propertyType;
    bedroomsDetailsTag.innerHTML = bedrooms;
    monthlyRentPriceDetailsTag.innerHTML = moneyFormatter.format(monthlyRentPrice);
    furnitureTypeDetailsTag.innerHTML = furnitureType;
    cityDetailsTag.innerHTML = getCityNameBySlug(city);
    reporterDetailsTag.innerHTML = nameOfTheReporter;
    dateDetailsTag.innerHTML = `${createdDate}`;
    timeDetailsTag.innerHTML = `${createdTime}`;
    if (!note) {
        noteDetailsTag.innerHTML = "There is no note";
    } else {
        noteDetailsTag.innerHTML = note;
    }
}

// @param 
// none
// @func
// Set an event listener for all view more button
// in the property so that it can redirect to
// the property details page
// @return
// null
const enableViewMorePropertyButton = () => {
    const viewMoreButtons = Array.from(document.querySelectorAll(".view-more-btn"));

    viewMoreButtons.forEach(viewMoreButton => {
        viewMoreButton.addEventListener("click", onGoToPropertyDetails)
    })
}

// @param 
// param1: propertyItemDoc: Doc
// param2: index: Int
// @func
// Render a property item based on the data from
// propertyItemDoc
// @return
// null
const renderProperty = (propertyItemDoc, index) => {
    const {
        id,
        propertyType,
        bedrooms,
        createdDate,
        createdTime,
        createdDateTimeText,
        monthlyRentPrice,
        furnitureType,
        city,
        note,
        nameOfTheReporter
    } = propertyItemDoc;
    const propertyList = document.querySelector(".property-list");
    const propertyItem = `
    <li class="property-item card" data-id="${id}">
        <div class="card-body">
            <h5 class="card-title">Property ${index}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${propertyType}</h6>
        <div class="property-desc">
            <ul>
                <li>Bedrooms: ${bedrooms}</li>
                <li>Monthly Rent Price: ${moneyFormatter.format(monthlyRentPrice)}</li>
                <li>Furniture Type: ${furnitureType}</li>
                <li>City: ${getCityNameBySlug(city)}</li>
                <li>${createdDateTimeText}</li>
                <li>Reporter: ${nameOfTheReporter}</li>
            </ul>
        </div>

            <div class="card-link-container">
                <button class="view-more-btn card-link btn btn-primary" data-id="${id}">View More</button>
            </div>
        </div>
    </li>
    `;

    propertyList.innerHTML += propertyItem;
}

// @param 
// none
// @func
// Asynchronously fetch all the properties in the database
// @return
// null
const getProperties = async () => {
    try {
        const propertyList = document.querySelector(".property-list");
        propertyList.innerHTML = "";
        const propertiesData = await db.collection("properties").get()
        propertiesData.docs.forEach((doc, index) => {
            renderProperty({
                ...doc.data(),
                id: doc.id
            }, index + 1)
        })
    } catch (error) {
        console.log(error);
    }
}

// @param 
// param1: e: EventObject
// @func
// Modify the sortCriteria in localStorage
// @return
// null
const changeSortCriteria = (e) => {
    e.preventDefault();

    localStorage.setItem("sortCriteria", e.target.value);
}

// @param 
// param1: list: Array
// @func
// Sort the list based on the sortCriteria in localStorage
// @return
// returnedList: Array
const sortTheProperties = (list) => {
    const sortCriteria = localStorage.getItem("sortCriteria");
    let returnedList = list;
    switch (sortCriteria) {
        case "price asc":
            returnedList = list.sort(function (a, b) {
                return parseInt(b.monthlyRentPrice) - parseInt(a.monthlyRentPrice);
            });
            break;
        case "price desc":
            returnedList = list.sort(function (a, b) {
                return parseInt(a.monthlyRentPrice) - parseInt(b.monthlyRentPrice);
            });
            break;
        default:
            break;
    }
    return returnedList;
}

// @param 
// param1: city: String
// @func
// Get all of the properties corresponding to the selected city
// And render them to the screen
// @return
// null
const getPropertiesByCity = async (city) => {

    if (!city) {
        return;
    }

    const propertyList = document.querySelector(".property-list");
    propertyList.innerHTML = "";

    try {
        let propertiesData = await db.collection("properties").get()

        let currentProperties = [];
        propertiesData.docs = propertiesData.docs.map(doc => {
            const element = doc.data();
            if (element.city === city) {
                currentProperties.push({
                    ...element,
                    id: doc.id
                });
            }
        })

        if (currentProperties.length === 0 && alternate) {
            propertyList.innerHTML = `
                <p>Currently there is no property in this location</p>
                <a href="./add-property.html" class="btn btn-primary">Create Property</a>
            `
        }

        currentProperties = sortTheProperties(currentProperties);
        currentProperties.forEach((propertyItem, index) => {
            renderProperty(propertyItem, index + 1)
        })
        enableViewMorePropertyButton()
    } catch (error) {
        console.log(error.message);
        propertyList.innerHTML = `
                <h4>An error has occured</h4>
                <p>${error.message}</p>
            `
    }
}

// @param 
// none
// @func
// Get all of the funiture types and render them as options
// in the select box
// @return
// null
const getFurnitureType = () => {
    const furnitureSelectBox = document.querySelector("select#furnitureType");

    for (let index = 0; index < furniture_condition.length; index++) {
        const element = furniture_condition[index];
        const option = document.createElement("option");
        option.innerHTML = element;
        option.setAttribute("value", element)
        if (index === 0) {
            option.setAttribute("selected", true)
        }
        furnitureSelectBox.appendChild(option);
    }
}

// @param 
// none
// @func
// Get all of the property types and render them as options
// in the select box
// @return
// null
const getPropertyType = () => {
    const propertySelectBox = document.querySelector("select#propertyType");

    for (let index = 0; index < house_types.length; index++) {
        const element = house_types[index];
        const option = document.createElement("option");
        option.innerHTML = element;
        option.setAttribute("value", element)
        if (index === 0) {
            option.setAttribute("selected", true)
        }
        propertySelectBox.appendChild(option);
    }
}

// @param 
// none
// @func
// Get all of the bedroom types and render them as options
// in the select box
// @return
// null
const getBedroomType = () => {
    const bedroomSelectBox = document.querySelector("select#bedrooms");

    if (!bedroomSelectBox) {
        return;
    }

    for (let index = 0; index < bedrooms_types.length; index++) {
        const element = bedrooms_types[index];
        const option = document.createElement("option");
        option.innerHTML = element;
        option.setAttribute("value", element)
        if (index === 0) {
            option.setAttribute("selected", true)
        }
        bedroomSelectBox.appendChild(option);
    }
}

// @param 
// none
// @func
// Get all of the cities and render them as options
// in the select box
// @return
// null
const getCities = () => {
    const citySelectBox = document.querySelector("select#city");
    const cities = tinh_tp_data;

    if (!citySelectBox) {
        return;
    }

    for (let index = 0; index < ordered_cities_key.length; index++) {
        const key = ordered_cities_key[index];
        const city = cities[key];

        const option = document.createElement("option");
        option.innerHTML = city.name;
        option.setAttribute("value", city.slug)
        option.setAttribute("text-data", city.name)
        citySelectBox.appendChild(option);
    }
}

// @param 
// param1: e: EventObject
// @func
// Trigger when the users search for properties on city
// Get the data from the select box and push them to
// the getPropertiesByCity function
// @return
// null
const onSearchCity = (e) => {
    e.preventDefault();
    const selectedCity = document.querySelector("#location-form #city");
    const selectedCitySlug = selectedCity.value;

    if (!selectedCitySlug) {
        return;
    }

    const designatedCity = document.querySelector(".designted-location");
    designatedCity.innerHTML = getCityNameBySlug(selectedCitySlug);

    getPropertiesByCity(selectedCitySlug);
}

// @param 
// param1: e: EventObject
// @func
// Trigger when the users create a new property 
// Perform data validation and put preview data in 
// a modal
// @return
// null
const onCreateProperty = (e) => {
    e.preventDefault();

    const isCorrect = checkInputsForAddProperty();

    if (!isCorrect) {
        return;
    }

    const form = document.querySelector("#add-property-form");
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const datetime = "Created: " + today.getDate() + "/" +
        (today.getMonth() + 1) + "/" +
        today.getFullYear() + " @ " +
        today.getHours() + ":" +
        today.getMinutes() + ":" +
        today.getSeconds();

    const newProperty = {
        propertyType: form.propertyType.value,
        bedrooms: form.bedrooms.value,
        createdDate: date,
        createdTime: time,
        createdDateTimeText: datetime,
        monthlyRentPrice: form.monthlyRentPrice.value,
        furnitureType: form.furnitureType.value,
        city: form.city.value,
        note: form.note.value,
        nameOfTheReporter: form.nameOfTheReporter.value
    }

    localStorage.setItem("newProperty", JSON.stringify(newProperty))

    const comfirmationModalBody = document.querySelector("#add-property-modal .modal-body");

    const {
        propertyType,
        bedrooms,
        createdDate,
        createdTime,
        monthlyRentPrice,
        furnitureType,
        city,
        note,
        nameOfTheReporter
    } = newProperty;

    const propertyDetailsData = `
    <div class="row row-details">
        <div class="col-6 details-title">
            <h4>Property Type:</h4>
        </div>
        <div class="col-6">
            <p class="details-property-type details-content">
                ${propertyType}
            </p>
        </div>
    </div>  

    <div class="row row-details">
        <div class="col-6 details-title">
            <h4>Bedrooms:</h4>
        </div>
        <div class="col-6">
            <p class="details-bedrooms details-content">
                ${bedrooms}
            </p>
        </div>
    </div>

    <div class="row row-details">
        <div class="col-6 details-title">
            <h4>Monthly Rent Price:</h4>
        </div>
        <div class="col-6">
            <p class="details-monthlyRentPrice details-content">
                ${monthlyRentPrice}
            </p>
        </div>
    </div>

    <div class="row row-details">
        <div class="col-6 details-title">
            <h4>Furniture Type:</h4>
        </div>
        <div class="col-6">
            <p class="details-furnitureType details-content">
            ${furnitureType}
            </p>
        </div>
    </div>

    <div class="row row-details">
        <div class="col-6 details-title">
            <h4>City:</h4>
        </div>
        <div class="col-6">
            <p class="details-city details-content">
            ${getCityNameBySlug(city)}
            </p>
        </div>
    </div>

    <div class="row row-details">
        <div class="col-6 details-title">
            <h4>Reporter:</h4>
        </div>
        <div class="col-6">
            <p class="details-reporter details-content">
            ${nameOfTheReporter}
            </p>
        </div>
    </div>

    <div class="row row-details">
        <div class="col-4 details-title">
            <h4>Created:</h4>
        </div>
        <div class="col-8">
            <p class="details-datetime details-content">
            ${date} @ ${time}
            </p>
        </div>
    </div>

    <div class="row row-details">
        <div class="col-12 details-title">
            <h4>Note:</h4>
        </div>
        <div class="col-12">
            <p class="details-note details-content">
                ${note === "" ? "N/A" : note}
            </p>
        </div>
    </div>
    `;

    comfirmationModalBody.innerHTML = propertyDetailsData;

    $('#add-property-modal').modal('show')
}

// @param 
// param1: e: EventObject
// @func
// Trigger when the users confirm to create a new property 
// Put the new property into the database
// @return
// null
const onConfirmAddProperty = async (e) => {
    const newProperty = JSON.parse(localStorage.getItem("newProperty"));

    const d = await db.collection("properties").add(newProperty)

    window.location.href = "./index.html";
}

// @param 
// none
// @func
// Execute when the program start to 
// check for requirements and initiate core functions
// @return
// null
const initialize = () => {
    localStorage.setItem("sortCriteria", "price asc");

    const propertyRentalPriceInput = document.querySelector("#property-rental-price");
    const furnitureSelectBox = document.querySelector("select#furnitureType");
    const propertySelectBox = document.querySelector("select#propertyType");
    const locationForm = document.querySelector("#location-form");
    const addPropertyForm = document.querySelector("#add-property-form");
    const editPropertyForm = document.querySelector("#edit-property-form");
    const addImageForm = document.querySelector("#add-image-form");
    const addNoteForm = document.querySelector("#add-note-form");
    const authorForm = document.querySelector("#author-form");
    const detailedSearchForm = document.querySelector("#detailed-search-form");
    const comfirmationButton = document.querySelector(".comfirmation-button");
    const sorterSelect = document.querySelector("select#sorter");
    const costCalForm = document.querySelector("#cost-cal-form");

    renderPropertyDetails();
    getCities();
    getBedroomType();
    renderEditPropertyPage();
    renderAllTheNotes();
    renderAllTheImages();
    renderSearchPropertyList();
    uploadImageAbility();
    
    if (propertyRentalPriceInput) {
        propertyRentalPriceInput.addEventListener("keyup", renderInitRentalPayment)
    }
    if (costCalForm) {
        costCalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            calculateTheCost();
        })
    }
    if (sorterSelect) {
        sorterSelect.addEventListener("change", (e) => {
            changeSortCriteria(e);
            if (locationForm) {
                const selectedCity = document.querySelector("#location-form #city");
                const selectedCitySlug = selectedCity.value;

                if (selectedCitySlug) {
                    getPropertiesByCity(selectedCitySlug);
                }
            }
            renderSearchPropertyList();
        });
    }
    if (furnitureSelectBox) {
        getFurnitureType();
    }
    if (addImageForm) {
        addImageForm.addEventListener("submit", addImageFunctionality);
    }
    if (propertySelectBox) {
        getPropertyType();
    }
    if (locationForm) {
        locationForm.addEventListener("submit", onSearchCity);
    }
    if (addPropertyForm) {
        addPropertyForm.addEventListener("submit", onCreateProperty);
    }
    if (editPropertyForm) {
        editPropertyForm.addEventListener("submit", onUpdateProperty);
    }
    if (addNoteForm) {
        addNoteForm.addEventListener("submit", onAddNote);
    }
    if (authorForm) {
        authorForm.addEventListener("submit", onSearchNoteAuthor)
    }
    if (detailedSearchForm) {
        detailedSearchForm.addEventListener("submit", onDetailedSearchSubmit)
    }
    if (comfirmationButton) {
        comfirmationButton.addEventListener("click", onConfirmAddProperty)
    }
}

// Run program
initialize();