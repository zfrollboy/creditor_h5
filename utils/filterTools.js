var debtStatus = function (status) {
  switch (status) {
    case 1:
      return "审核中"
    case 2:
      return "审核通过"
    case 3:
      return "审核失败"
    default:
      return ""
  }
}
module.exports = {
  debtStatus: debtStatus
}