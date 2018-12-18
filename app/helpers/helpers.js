


function validateDate(d) {
    // String -> Boolean
    // Validates Date based on it being a valid date object

    if (!(/\d\d\d\d\-\d\d\-\d\d/.test(d))) return false;
    let [year, month, day] = d.split("-");
    const dateObj = new Date(year, month - 1, day);

    return dateObj && dateObj.getMonth() + 1 === parseInt(month); //also test for month condition as this might get wrapped around if day is out of range
}



module.exports = {
    validateDate : validateDate
}