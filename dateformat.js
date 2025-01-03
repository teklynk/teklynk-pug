import moment from "moment";

const dateformat = (text) => {
    return moment(text).format('MMMM Do YYYY');
}

export default dateformat;