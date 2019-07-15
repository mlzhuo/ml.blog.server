export function formatDateWithTz(datetime) {
  if (datetime.indexOf('T') === -1) {
    datetime = datetime.replace(/ /, 'T');
  }
  if (datetime.endsWith('Z') || datetime.indexOf('+') !== -1) {
    return datetime;
  }
  return datetime + '+08:00';
}

export function formatDateWithT(datetime) {
  if (datetime.indexOf('T') === -1) {
    datetime = datetime.replace(/ /, 'T');
  }
  return datetime;
}

export function formatDate(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
}

// 处理 Safari 日期兼容问题
export function getDateDiff(diffTime) {
  // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  return diffTime.replace(/-/g, '/');
}

export function formatMonthDate(date) {
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return month + '/' + day;
}

export function formatMonth(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return year + '-' + month;
}

export function formatDateHours(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let hours = date.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  let seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return (
    year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  );
}

export function formatMonthAgo(date) {
  const year = date.getFullYear();
  date.setMonth(date.getMonth() - 1);
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = 0 + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = 0 + day;
  }
  return year + '-' + month + '-' + day;
}

export function formatHours(time) {
  if (time) {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  }
  return '-';
}

export function formatMin(time) {
  if (time) {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const seconds = time.getSeconds();
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return hours + ':' + minutes;
  }
  return '-';
}

export function formatSeconds(value) {
  let theTime = parseInt(value); // 秒
  let theTime1 = 0; // 分
  let theTime2 = 0; // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  let result = '' + parseInt(theTime) + '秒';
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分' + result;
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result;
  }
  return result;
}

export function getDatesOfWeek(lastDay) {
  return Array.apply(null, { length: 7 })
    .map((v, i) => new Date(lastDay.getTime() - i * 24 * 60 * 60 * 1000))
    .reverse();
}

export function formatMonthDay(date) {
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return m + '/' + d;
}

export function checkIdCard(value) {
  const regx15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
  const regx18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  return regx18.test(value) || regx15.test(value);
}

export function checkPhone(value) {
  const mobile = /^1[3|5|6|7|8]\d{9}$/;
  return mobile.test(value);
}

function getObjectLength(object) {
  let count = 0;
  for (const i in object) count++;
  return count;
}

export function checkIsAndroid() {
  // console.log('==navigator.userAgent==', navigator.userAgent.indexOf('Android'))
  const browser = {
    versions: (function() {
      const u = navigator.userAgent;
      return {
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android:
          u.indexOf('Android') > -1 ||
          u.indexOf('Linux') > -1 ||
          u.indexOf('Adr') > -1,
        iPhone: u.indexOf('iPhone') > -1,
        iPad: u.indexOf('iPad') > -1
      };
    })()
  };
  if (browser.versions.android) {
    return true;
  }
  return false;
}

export function isIos() {
  return (
    /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) &&
    !(navigator.userAgent.indexOf('wechatdevtools') > -1)
  );
}
