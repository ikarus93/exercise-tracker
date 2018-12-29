function validateDate(d) {
    // String -> Boolean
    // Validates Date based on it being a valid date object

    if (!(/\d\d\d\d\-\d\d\-\d\d/.test(d))) return false;

    let [year, month, day] = d.split("-");
    const dateObj = new Date(year, month - 1, day);

    return dateObj && dateObj.getMonth() + 1 === parseInt(month); //also test for month condition as this might get wrapped around if day is out of range
}

function compareDates(d1, d2) {
    // Date, Date -> Boolean
    // Returns true if d1 is larger than or equal d2

    [d1, d2] = [Date.parse(d1), Date.parse(d2)];


    return d1 > d2 || d1 === d2;
}



module.exports = {
    validateDate: validateDate,
    compareDates: compareDates
}