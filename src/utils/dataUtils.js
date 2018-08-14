const DateUtils = {};

/**
 * 根据当前时间和时差time 获取一天前的时间
 * @param time 距00:00时间差
 * @param type 1: 返回yyyy-mm-hh日期字符串，2: 返回日期的值
 * @returns {string || int}
 */
DateUtils.getDateWithHoursAndDays = (time, days = 0, type = 1) => {
    let day = new Date();
    if (day.getHours() < time) {
        day = new Date(day.valueOf() - (days + 1) * 24 * 60 * 60 * 1000);
    } else {
        day = new Date(day.valueOf() - days * 24 * 60 * 60 * 1000);
    }
    let month = day.getMonth() + 1 < 10 ? '0' + (day.getMonth() + 1).toString() : (day.getMonth() + 1).toString(),
        date = day.getDate() < 10 ? '0' + day.getDate().toString() : day.getDate().toString(),
        resultDay = day.getFullYear().toString() + '-' + month + '-' + date;
    if (type != 1){
        let tmpDay = new Date(resultDay);

        resultDay = tmpDay.valueOf() - 8 * 60 * 60 * 1000;
    }
    return resultDay;
}

export default DateUtils;