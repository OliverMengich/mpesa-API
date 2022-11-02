module.exports = function timeStamp() {
    let time = new Date();
    return time.toISOString();
}